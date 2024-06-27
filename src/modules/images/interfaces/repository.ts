import { Image } from '../model/image'

// xu ly nghiep vu - duoi database
export interface IImageRepository {
  insertImage(image: Image): Promise<string>
}
