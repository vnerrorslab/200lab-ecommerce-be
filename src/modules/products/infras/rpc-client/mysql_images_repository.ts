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
      console.log('ids', ids)
      const images = await ImagePersistence.findOne({
        where: {
          id: 'e32657f6-a7b1-4ed7-a212-b2719bbd3bf6',
          raw: true
        }
      })

      console.log('images', images)
      //   const result = images.map((image) => image.get({ plain: true }))
      //   console.log('result', result)
      return []
    } catch (error: any) {
      console.log('error', error.message)
      throw new Error(`Error finding images: ${error.message}`)
    }
  }

  //   async findByIds(ids: string[]): Promise<Image[]> {
  //     try {
  //       const query = `
  //         SELECT *
  //         FROM images
  //         WHERE id IN (:ids)
  //       `;

  //       const images = await this.sequelize.query(query, {
  //         replacements: { ids },
  //         type: QueryTypes.SELECT,
  //       });

  //       return images;
  //     } catch (error: any) {
  //       throw new Error(`Error finding images: ${error.message}`);
  //     }
  //   }
}
