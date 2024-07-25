import { Op } from 'sequelize'
import { ICategoryRepository } from '../../interfaces/repository'
import { Category } from '../../model/category'
import { CategoryPersistence } from './dto/category'

export class MySQLCategoryRepository implements ICategoryRepository {
  async findById(id: string): Promise<Category | null> {
    try {
      const category = await CategoryPersistence.findByPk(id)

      return category ? category.get({ plain: true }) : null
    } catch (error: any) {
      throw new Error(`Error finding category: ${error.message}`)
    }
  }

  async findByIds(ids: string[]): Promise<Category[]> {
    try {
      const categories = await CategoryPersistence.findAll({
        where: {
          id: {
            [Op.in]: ids
          }
        }
      })

      return categories.map((category) => category.get({ plain: true }))
    } catch (error: any) {
      throw new Error(`Error finding categories: ${error.message}`)
    }
  }
}
