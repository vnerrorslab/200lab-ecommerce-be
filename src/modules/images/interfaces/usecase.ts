import { ImageDetailDTO } from '../infras/transport/dto/image_detail'
import type { UploadImageDTO } from '../infras/transport/dto/image_uploaded'

//nghiep vu
export interface IImageUseCase {
  uploadImages(dto: UploadImageDTO): Promise<boolean>

  detailImage(id: string): Promise<ImageDetailDTO | null>
}
