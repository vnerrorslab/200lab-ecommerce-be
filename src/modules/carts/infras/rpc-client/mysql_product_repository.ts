import { Op } from 'sequelize'
import { IProductRepository } from '../../interfaces/repository'
import { ProductDetail } from '../../model/product'
import { ProductPersistence } from './dto/product'

export class MySQLProductRepository implements IProductRepository {
  async findById(id: string): Promise<ProductDetail | null> {
    try {
      const product = await ProductPersistence.findByPk(id)

      return product ? product.get({ plain: true }) : null
    } catch (error: any) {
      throw new Error(`Error finding product: ${error.message}`)
    }
  }

  async findByIds(ids: string[]): Promise<ProductDetail[]> {
    try {
      const products = await ProductPersistence.findAll({
        where: {
          id: {
            [Op.in]: ids
          }
        }
      })

      return products.map((product) => product.get({ plain: true }))
    } catch (error: any) {
      throw new Error(`Error finding products: ${error.message}`)
    }
  }
}
