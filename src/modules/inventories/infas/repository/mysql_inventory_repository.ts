import { Op, type Sequelize, type WhereOptions } from 'sequelize'
import { InventoryPersistence } from './dto/inventory'
import type { IInventoryRepository } from '../../interfaces/repository'
import type { Inventory, InventorySearchDTO, UpdateInventoryDTO } from '../../model/inventory'
import type { Paging } from '../../../../shared/dto/paging'
import { BaseStatus } from '~/shared/dto/status'

export class MysqlInventoryRepository implements IInventoryRepository {
  constructor(readonly sequelize: Sequelize) {}

  async list_paginate(
    condition: InventorySearchDTO,
    paging: Paging
  ): Promise<{ inventories: Inventory[]; total_pages: number }> {
    try {
      let whereClause: WhereOptions = {}

      if (condition.searchStr) {
        whereClause = {
          ...whereClause,
          [Op.or]: [{ name: { [Op.like]: `%${condition.searchStr}%` } }]
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

  async list_all(): Promise<Inventory[] | null> {
    const inventory = await InventoryPersistence.findAll({
      attributes: ['product_id', 'quantity', 'status']
    })

    return inventory ? inventory.map((inv) => inv.get({ plain: true })) : null
  }

  async save(data: Inventory): Promise<string> {
    try {
      const invData = {
        id: data.id,
        product_id: data.product_id,
        quantity: data.quantity,
        status: data.status,
        cost_price: data.cost_price,
        created_at: data.created_at,
        updated_at: data.updated_at
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
      const [affectedCount, [updatedInventory]] = await InventoryPersistence.update(data, {
        where: { id },
        returning: true
      })

      if (affectedCount > 0 && updatedInventory) {
        if (updatedInventory.getDataValue('quantity') === 0) {
          await InventoryPersistence.update(
            { status: BaseStatus.OUTOFSTOCK },
            { where: { product_id: updatedInventory.getDataValue('product_id') } }
          )
        }
      }

      return affectedCount > 0
    } catch (error: any) {
      throw new Error(`Error updating inventory: ${error.message}`)
    }
  }
}
