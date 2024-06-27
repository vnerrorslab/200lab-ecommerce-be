import { v4 as uuidv4 } from 'uuid'
import { IImageUseCase } from '../interfaces/usecase'
import { IImageRepository } from '../interfaces/repository'
import { UploadImageDTO } from '../infras/transport/dto/image_uploaded'
import { ImageStatus } from '~/shared/dto/status'
import { ImageDetailDTO } from '../infras/transport/dto/image_detail'
import { ErrImageNotFound } from '../model/image.error'

export class ImageUseCase implements IImageUseCase {
  constructor(readonly imageRepository: IImageRepository) {}

  async uploadImages(dto: UploadImageDTO): Promise<boolean> {
    try {
      dto.validate()
    } catch (error: any) {
      throw new Error(error.message)
    }

    const imageId = uuidv4()

    const uploadImages = {
      id: imageId,
      path: dto.path,
      width: dto.width,
      height: dto.height,
      size: dto.size,
      status: ImageStatus.UPLOADED
    }

    await this.imageRepository.insertImage(uploadImages)

    return true
  }

  async detailImage(id: string): Promise<ImageDetailDTO | null> {
    try {
      return await this.imageRepository.findById(id)
    } catch (error: any) {
      throw ErrImageNotFound
    }
  }
}
