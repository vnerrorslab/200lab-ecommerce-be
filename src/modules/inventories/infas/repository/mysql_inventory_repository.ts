import { Op, type Sequelize, type WhereOptions } from 'sequelize'
import { InventoryPersistence } from './dto/inventory'
import type { IInventoryRepository } from '../../interfaces/repository'
import type { Inventory, InventorySearchDTO, UpdateInventoryDTO } from '../../model/inventory'
import type { Paging } from '../../../../shared/dto/paging'
import { BaseStatus } from '~/shared/dto/status'

export class MysqlInventoryRepository implements IInventoryRepository {
  async list_paginate(
    condition: InventorySearchDTO,
    paging: Paging
  ): Promise<{ inventories: Inventory[]; total_pages: number }> {
    try {
      let whereClause: WhereOptions = {}

      if (condition.searchStr) {
        whereClause = {
          ...whereClause,
          [Op.or]: [{ status: { [Op.like]: `%${condition.searchStr}%` } }]
        }
      }

      const { rows: inventories, count: total_pages } = await InventoryPersistence.findAndCountAll({
        where: whereClause,
        limit: paging.limit,
        offset: (paging.page - 1) * paging.limit
      })

      return {
        inventories: inventories.map((inventory) => inventory.get({ plain: true })),
        total_pages
      }
    } catch (error: any) {
      throw new Error(`Error listing inventories: ${error.message}`)
    }
  }

  async list_all(productIds: string[]): Promise<Inventory[]> {
    const inventories = await InventoryPersistence.findAll({
      attributes: ['productId', 'quantity', 'status'],
      where: {
        productId: { [Op.in]: productIds }
      }
    })

    return inventories.map((inv) => inv.get({ plain: true }))
  }

  async findByProductId(productId: string): Promise<Inventory> {
    const inventory = await InventoryPersistence.findOne({ where: { productId } })

    return inventory?.get({ plain: true })
  }

  async save(data: Inventory): Promise<string> {
    try {
      const invData = {
        id: data.id,
        productId: data.productId,
        quantity: data.quantity,
        status: data.status,
        costPrice: data.costPrice,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      }

      const result = await InventoryPersistence.create(invData)

      return result.getDataValue('id')
    } catch (error: any) {
      throw new Error(`Error inserting inventory: ${error.message}`)
    }
  }

  async findById(id: string): Promise<Inventory | null> {
    try {
      const inventory = await InventoryPersistence.findByPk(id)

      return inventory ? inventory.get({ plain: true }) : null
    } catch (error: any) {
      throw new Error(`Error finding inventory: ${error.message}`)
    }
  }

  async update(id: string, data: UpdateInventoryDTO): Promise<boolean> {
    try {
      const [affectedCount] = await InventoryPersistence.update(data, { where: { id } })
      return affectedCount > 0
    } catch (error: any) {
      throw new Error(`Error updating inventory: ${error.message}`)
    }
  }
}
