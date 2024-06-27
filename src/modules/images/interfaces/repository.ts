import { ImageDetailDTO } from '../infras/transport/dto/image_detail'
import { Image } from '../model/image'

// xu ly nghiep vu - duoi database
export interface IImageRepository {
  insertImage(image: Image): Promise<string>

  findById(id: string): Promise<ImageDetailDTO | null>
}
