import { Op, Sequelize } from 'sequelize'
import { IBrandRepository } from '../../interfaces/repository'
import { Brand } from '../../model/brand'
import { BrandPersistence } from './dto/brand'

export class MySQLBrandRepository implements IBrandRepository {
  constructor(readonly sequelize: Sequelize) {}

  async findById(id: string): Promise<Brand | null> {
    try {
      const brand = await BrandPersistence.findByPk(id)

      return brand ? brand.get({ plain: true }) : null
    } catch (error: any) {
      throw new Error(`Error finding brand: ${error.message}`)
    }
  }

  async findByIds(ids: string[]): Promise<Brand[]> {
    try {
      const brands = await BrandPersistence.findAll({
        where: {
          id: {
            [Op.in]: ids
          }
        }
      })
      return brands.map((brand) => brand.get({ plain: true }))
    } catch (error: any) {
      throw new Error(`Error finding brands: ${error.message}`)
    }
  }
}
