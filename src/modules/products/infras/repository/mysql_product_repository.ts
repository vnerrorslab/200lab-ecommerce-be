import { Op, Sequelize, type WhereOptions } from 'sequelize'

import type { IProductRepository } from '../../interfaces/repository'
import { Product, ProductListingConditionDTO, ProductUpdateDTO } from '../../model/product'
import { ProductPersistence } from './dto/product'
import type { Paging } from '~/shared/dto/paging'
import { BaseStatus } from '~/shared/dto/status'
import type { ProductDetailDTO } from '../transport/dto/product_detail'

export class MySQLProductsRepository implements IProductRepository {
  constructor(readonly sequelize: Sequelize) {}

  async insertProduct(data: Product): Promise<string> {
    try {
      const productData = {
        id: data.id,
        name: data.name,
        images: data.images,
        price: data.price,
        quantity: data.quantity,
        brandId: data.brandId,
        categoryId: data.categoryId,
        description: data.description,
        status: data.status,
        createdBy: data.createdBy,
        updatedBy: data.updatedBy
      }

      const result = await ProductPersistence.create(productData)

      return result.getDataValue('id')
    } catch (error: any) {
      throw new Error(`Error inserting product: ${error.message}`)
    }
  }

  async findByName(name: string): Promise<Product | null> {
    try {
      const product = await ProductPersistence.findOne({ where: { name } })

      return product ? product.get({ plain: true }) : null
    } catch (error: any) {
      throw new Error(`Error finding product: ${error.message}`)
    }
  }

  async findById(id: string): Promise<Product | null> {
    try {
      const product = await ProductPersistence.findByPk(id)

      return product ? product.get({ plain: true }) : null
    } catch (error: any) {
      throw new Error(`Error finding product: ${error.message}`)
    }
  }

  async listingProduct(
    condition: ProductListingConditionDTO,
    paging: Paging
  ): Promise<{ products: Product[]; total_pages: number }> {
    try {
      let whereClause: WhereOptions = { status: BaseStatus.ACTIVE }

      if (condition.searchStr) {
        whereClause = {
          ...whereClause,
          [Op.or]: [{ name: { [Op.like]: `%${condition.searchStr}%` } }]
        }
      }

      const { rows: products, count: total_pages } = await ProductPersistence.findAndCountAll({
        where: whereClause,
        limit: paging.limit,
        offset: (paging.page - 1) * paging.limit
      })

      return {
        products: products.map((product) => product.get({ plain: true })),
        total_pages
      }
    } catch (error: any) {
      throw new Error(`Error listing products: ${error.message}`)
    }
  }

  async updateProductById(id: string, dto: ProductUpdateDTO): Promise<boolean> {
    try {
      const [affectedCount] = await ProductPersistence.update(dto, {
        where: { id }
      })
      return affectedCount > 0
    } catch (error: any) {
      throw new Error(`Error updating product: ${error.message}`)
    }
  }

  async deleteProductById(id: string): Promise<boolean> {
    try {
      const result = await ProductPersistence.update(
        { status: BaseStatus.INACTIVE },

        { where: { id } }
      )

      return result[0] > 0
    } catch (error: any) {
      throw new Error(`Error deleting product: ${error.message}`)
    }
  }

  async findProductById(id: string): Promise<ProductDetailDTO | null> {
    const product = await ProductPersistence.findByPk(id, {
      attributes: ['id', 'name', 'images', 'price', 'quantity', 'brandId', 'categoryId', 'description', 'status']
    })

    if (!product) return null

    return product ? product.get({ plain: true }) : null
  }
}
