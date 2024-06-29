import { v4 as uuidv4 } from 'uuid'
import { IImageDeleter, IImageUploader, IImageUseCase } from '../interfaces/usecase'
import { IImageRepository } from '../interfaces/repository'
import { ImageStatus } from '~/shared/dto/status'
import { ImageDetailDTO } from '../infras/transport/dto/image_detail'
import { ErrImageNotFound } from '../model/image.error'
import sizeOf from 'image-size'
import fs from 'fs'

export class ImageUseCase implements IImageUseCase {
  constructor(
    readonly imageRepository: IImageRepository,
    readonly imageUploader: IImageUploader,
    readonly imageDeleter: IImageDeleter
  ) {}

  async uploadImage(filename: string, filesize: number, contentType: string): Promise<string> {
    //get width, height
    const dimensions = sizeOf(filename)

    this.imageUploader.uploadImage(filename, filesize, contentType)

    const imageId = uuidv4()

    const uploadImages = {
      id: imageId,
      path: filename,
      cloud_name: this.imageUploader.cloudName(),
      width: dimensions.width as number,
      height: dimensions.height as number,
      size: filesize,
      status: ImageStatus.UPLOADED
    }

    await this.imageRepository.insertImage(uploadImages)

    if (this.imageUploader.cloudName() !== 'local') {
      //xóa file
      fs.unlink(filename, (err) => {
        if (err) {
          console.error(err)
          return
        }
      })
    }

    return imageId
  }

  async detailImage(id: string): Promise<ImageDetailDTO | null> {
    try {
      return await this.imageRepository.findById(id)
    } catch (error: any) {
      throw ErrImageNotFound
    }
  }

  async deleteImage(filename: string): Promise<boolean> {
    try {
      const image = await this.imageRepository.findByPath(filename)
      if (!image) {
        throw ErrImageNotFound
      }

      if (this.imageDeleter.cloudName() !== 'local') {
        this.imageDeleter.deleteImage(filename)
      } else {
        fs.unlink(filename, (err) => {
          if (err) {
            console.error(err)
            return false
          }
        })
      }

      await this.imageRepository.deleteImageById(image.id)

      return true
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  async changeStatus(id: string, status: string): Promise<boolean> {
    try {
      return await this.imageRepository.updateStatus(id, status)
    } catch (error: any) {
      throw new Error(error.message)
    }
  }
}
