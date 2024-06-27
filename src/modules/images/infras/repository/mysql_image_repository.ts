import { Sequelize } from 'sequelize'
import { IImageRepository } from '../../interfaces/repository'
import { Image } from '../../model/image'
import { ImagePersistence } from './dto/image'

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
}
