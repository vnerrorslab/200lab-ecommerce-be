import { ImageDetailDTO } from '../infras/transport/dto/image_detail'

//nghiep vu
export interface IImageUseCase {
  uploadImage(filename: string, filesize: number, contentType: string): Promise<string>

  detailImage(id: string): Promise<ImageDetailDTO | null>

  deleteImage(id: string): Promise<boolean>
}

export interface IImageUploader {
  uploadImage(filename: string, filesize: number, contentType: string): Promise<boolean>
  cloudName(): string
}
