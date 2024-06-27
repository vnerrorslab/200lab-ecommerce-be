import { Router, type Request, type Response } from 'express'
import multer from 'multer'
import sizeOf from 'image-size'
import fs from 'fs'

import { IImageUseCase } from '~/modules/images/interfaces/usecase'
import { UploadImageDTO } from '../dto/image_uploaded'

import { uploadFileToS3 } from '~/shared/utils/upload-service'
import { ImageStatus } from '~/shared/dto/status'
import { ErrImageType } from '~/modules/images/model/image.error'

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

    return router
  }
}
