import { ImageDetailDTO } from '../infras/transport/dto/image_detail'

//nghiep vu
export interface IImageUseCase {
  uploadImage(filename: string, filesize: number, contentType: string): Promise<string>

  detailImage(id: string): Promise<ImageDetailDTO | null>

  deleteImage(filename: string): Promise<boolean>

  changeStatus(id: string, status: string): Promise<boolean>
}

export interface IImageUploader {
  uploadImage(filename: string, filesize: number, contentType: string): Promise<boolean>
  cloudName(): string
}

export interface IImageDeleter {
  deleteImage(filename: string): Promise<boolean>
  cloudName(): string
}
