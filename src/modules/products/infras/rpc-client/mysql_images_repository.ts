import { Op, Sequelize } from 'sequelize'
import { IImageRepository } from '../../interfaces/repository'
import { Image } from '../../model/image'
import { ImagePersistence } from './dto/image'

export class MySQLImagesRepository implements IImageRepository {
  constructor(readonly sequelize: Sequelize) {}

  async findById(id: string): Promise<Image | null> {
    try {
      const image = await ImagePersistence.findByPk(id)

      return image ? image.get({ plain: true }) : null
    } catch (error: any) {
      throw new Error(`Error finding image: ${error.message}`)
    }
  }

  async findByIds(ids: string[]): Promise<Image[]> {
    try {
      const images = await ImagePersistence.findAll({
        where: {
          id: {
            [Op.in]: ids
          }
        }
      })

      const result = images.map((image) => image.get({ plain: true }))
      return result
    } catch (error: any) {
      console.log('error', error)
      throw new Error(`Error finding images: ${error.message}`)
    }
  }
}
