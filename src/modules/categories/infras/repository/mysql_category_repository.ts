import { Op, Sequelize, type WhereOptions } from 'sequelize'

import type { ICategoryRepository } from '../../interfaces/repository'
import { Category, CategoryListingConditionDTO, CategoryUpdateDTO } from '../../model/category'
import { CategoryPersistence } from './dto/category'
import type { Paging } from '~/shared/dto/paging'
import { BaseStatus } from '~/shared/dto/status'
import type { CategoryDetailDTO } from '../transport/dto/category_detail'

export class MySQLCategoryRepository implements ICategoryRepository {
  constructor(readonly sequelize: Sequelize) {}

  async insertCategory(data: Category): Promise<string> {
    try {
      const categoryData = {
        id: data.id,
        name: data.name,
        description: data.description,
        status: data.status,
        parent_id: data.parent_id
      }

      const result = await CategoryPersistence.create(categoryData)

      return result.getDataValue('id')
    } catch (error: any) {
      throw new Error(`Error inserting Category: ${error.message}`)
    }
  }

  async findByName(name: string): Promise<Category | null> {
    try {
      const category = await CategoryPersistence.findOne({ where: { name } })

      return category ? category.get({ plain: true }) : null
    } catch (error: any) {
      throw new Error(`Error finding Category: ${error.message}`)
    }
  }

  async findById(id: string): Promise<Category | null> {
    try {
      const category = await CategoryPersistence.findByPk(id)

      return category ? category.get({ plain: true }) : null
    } catch (error: any) {
      throw new Error(`Error finding Category: ${error.message}`)
    }
  }

  async listingCategory(
    condition: CategoryListingConditionDTO,
    paging: Paging
  ): Promise<{ categorys: Category[]; total_pages: number }> {
    try {
      let whereClause: WhereOptions = {}

      if (condition.searchStr) {
        whereClause = {
          ...whereClause,
          [Op.or]: [{ name: { [Op.like]: `%${condition.searchStr}%` } }]
        }
      }

      const { rows: categorys, count: total_pages } = await CategoryPersistence.findAndCountAll({
        where: whereClause,
        limit: paging.limit,
        offset: (paging.page - 1) * paging.limit
      })

      return {
        categorys: categorys.map((category) => category.get({ plain: true })),
        total_pages
      }
    } catch (error: any) {
      throw new Error(`Error listing Categorys: ${error.message}`)
    }
  }

  async updateCategoryById(id: string, dto: CategoryUpdateDTO): Promise<boolean> {
    try {
      const [affectedCount] = await CategoryPersistence.update(dto, { where: { id } })
      return affectedCount > 0
    } catch (error: any) {
      throw new Error(`Error updating Category: ${error.message}`)
    }
  }

  async deleteCategoryById(id: string): Promise<boolean> {
    try {
      const result = await CategoryPersistence.update(
        { status: BaseStatus.INACTIVE },

        { where: { id } }
      )

      return result[0] > 0
    } catch (error: any) {
      throw new Error(`Error deleting Category: ${error.message}`)
    }
  }

  async findCategoryById(id: string): Promise<CategoryDetailDTO | null> {
    const category = await CategoryPersistence.findByPk(id, {
      attributes: ['id', 'name', 'description', 'status', 'parent_id']
    })

    if (!category) return null

    return category ? category.get({ plain: true }) : null
  }
}
