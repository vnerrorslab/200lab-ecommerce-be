import { Sequelize, Op, type WhereOptions } from 'sequelize'

import type { Paging } from '~/shared/dto/paging'
import type { ICartRepository } from '../../interfaces/repository'
import { CartPersistence } from './dto/cart'
import { Cart, CartListingConditionDTO, CartUpdateDTO } from '../../model/cart'

export class MySQLCartRepository implements ICartRepository {
  constructor(readonly sequelize: Sequelize) {}

  async insert(data: Cart): Promise<string> {
    try {
      const cartData = {
        id: data.id,
        product_id: data.product_id,
        quantity: data.quantity,
        unit_price: data.unit_price,
        created_by: data.created_by
      }

      const result = await CartPersistence.create(cartData)

      return result.getDataValue('id')
    } catch (error: any) {
      throw new Error(`Error inserting cart: ${error.message}`)
    }
  }

  async findProductById(productId: string): Promise<Cart | null> {
    try {
      const cart = await CartPersistence.findOne({ where: { product_id: productId } })
      return cart ? cart.get({ plain: true }) : null
    } catch (error: any) {
      throw new Error(`Error finding cart by product ID: ${error.message}`)
    }
  }

  async findById(id: string): Promise<Cart | null> {
    try {
      const cart = await CartPersistence.findByPk(id)
      return cart ? cart.get({ plain: true }) : null
    } catch (error: any) {
      throw new Error(`Error finding cart by product ID: ${error.message}`)
    }
  }

  async list(condition: CartListingConditionDTO, paging: Paging): Promise<{ carts: Cart[]; total_pages: number }> {
    try {
      let whereClause: WhereOptions = {}

      if (condition.searchStr) {
        whereClause = {
          ...whereClause,
          [Op.or]: [{ unit_price: { [Op.like]: `%${condition.searchStr}%` } }]
        }
      }

      const { rows: carts, count: total_count } = await CartPersistence.findAndCountAll({
        where: whereClause,
        limit: paging.limit,
        offset: (paging.page - 1) * paging.limit
      })

      const total_pages = Math.ceil(total_count / paging.limit)

      return {
        carts: carts.map((cart) => cart.get({ plain: true })),
        total_pages
      }
    } catch (error: any) {
      throw new Error(`Error listing carts: ${error.message}`)
    }
  }

  async updateQuantityById(id: string, dto: CartUpdateDTO): Promise<boolean> {
    try {
      const result = await CartPersistence.update({ quantity: dto.quantity }, { where: { id } })

      return result[0] > 0
    } catch (error: any) {
      throw new Error(`Error updating cart: ${error.message}`)
    }
  }

  async deleteItemById(id: string): Promise<boolean> {
    try {
      const result = await CartPersistence.destroy({ where: { id } })
      return result > 0
    } catch (error: any) {
      throw new Error(`Error deleting cart: ${error.message}`)
    }
  }
}
