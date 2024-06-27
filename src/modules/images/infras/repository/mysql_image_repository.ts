import { Sequelize } from 'sequelize'
import { IImageRepository } from '../../interfaces/repository'
import { Image } from '../../model/image'
import { ImagePersistence } from './dto/image'
import { ImageDetailDTO } from '../transport/dto/image_detail'

export class MySQLImagesRepository implements IImageRepository {
  constructor(readonly sequelize: Sequelize) {}

  async insertImage(data: Image): Promise<string> {
    try {
      const imageData = {
        id: data.id,
        path: data.path,
        width: data.width,
        height: data.height,
        size: data.size
      }

      const result = await ImagePersistence.create(imageData)

      return result.getDataValue('id')
    } catch (error: any) {
      throw new Error(`Error inserting image: ${error.message}`)
    }
  }

  async findById(id: string): Promise<ImageDetailDTO | null> {
    try {
      const image = await ImagePersistence.findByPk(id)

      return image ? image.get({ plain: true }) : null
    } catch (error: any) {
      throw new Error(`Error finding image: ${error.message}`)
    }
  }
}
