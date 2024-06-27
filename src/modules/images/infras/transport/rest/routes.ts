import { Router, type Request, type Response } from 'express'
import multer from 'multer'
import sizeOf from 'image-size'
import fs from 'fs'

import { IImageUseCase } from '~/modules/images/interfaces/usecase'
import { UploadImageDTO } from '../dto/image_uploaded'

import { s3, uploadFileToS3 } from '~/shared/utils/upload-service'
import { ImageStatus } from '~/shared/dto/status'
import { ErrImageType } from '~/shared/error'
import { ErrImageNotFound } from '~/modules/images/model/image.error'
import { DeleteObjectCommand } from '@aws-sdk/client-s3'
// import { config } from 'dotenv'

export class ImageService {
  constructor(readonly imageUseCase: IImageUseCase) {}

  async insert_image(req: Request, res: Response) {
    try {
      const file = req.file as Express.Multer.File

      //check image type
      if (!file.mimetype.startsWith('image')) {
        res.status(400).send({ error: ErrImageType.message })
        return
      }

      //get width, height
      const dimensions = sizeOf(file.destination + '/' + file.filename)

      //upload file to s3
      try {
        await uploadFileToS3({
          filename: file.destination + '/' + file.filename,
          contentType: file.mimetype
        })
      } catch (error) {
        res.status(500).send({ error: 'Error uploading file' })
        return
      }

      const imageDTO = new UploadImageDTO(
        file.destination + '/' + file.filename,
        dimensions.width as number,
        dimensions.height as number,
        file?.size,
        ImageStatus.UPLOADED
      )
      const resultInsert = await this.imageUseCase.uploadImages(imageDTO)

      if (resultInsert) {
        //xóa file
        fs.unlink(file.destination + '/' + file.filename, (err) => {
          if (err) {
            console.error(err)
            return
          }
        })
      }

      res.status(201).send({
        code: 201,
        message: 'insert image successful'
      })
    } catch (error: any) {
      res.status(400).send({ error: error.message })
    }
  }

  async detail_image(req: Request, res: Response) {
    try {
      const { id } = req.params

      const image = await this.imageUseCase.detailImage(id)

      if (!image) {
        return res.status(404).json({ code: 404, message: ErrImageNotFound })
      }

      const fullPath = process.env.URL_PUBLIC + '/' + image.path

      return res.status(200).json({ code: 200, message: 'image', data: { ...image, path: fullPath } })
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  }

  async delete_image(req: Request, res: Response) {
    try {
      const { id } = req.params

      const image = await this.imageUseCase.detailImage(id)

      if (!image) {
        return res.status(404).json({ code: 404, message: ErrImageNotFound })
      }

      const deleteParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: image.path
      }

      //delete file on s3
      try {
        s3.send(new DeleteObjectCommand(deleteParams))
      } catch (error) {
        res.status(500).send({ error: 'Error deleting file' })
        return
      }

      await this.imageUseCase.deleteImage(id)

      res.status(200).send({ code: 200, message: 'delete image successful' })
    } catch (error: any) {
      res.status(400).send({ error: error.message })
    }
  }

  setupRoutes(): Router {
    const router = Router()

    //multer
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'uploads')
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null, uniqueSuffix + '-' + file.originalname)
      }
    })

    const upload = multer({
      storage: storage,
      fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        if (file.mimetype.startsWith('image/')) {
          cb(null, true)
        } else {
          cb(null, false)
        }
      }
    })

    router.post('/images', upload.single('image'), this.insert_image.bind(this))

    router.get('/images/:id', this.detail_image.bind(this))

    router.delete('/images/:id', this.delete_image.bind(this))

    return router
  }
}
