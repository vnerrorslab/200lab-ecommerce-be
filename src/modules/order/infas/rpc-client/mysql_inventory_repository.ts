import { Op } from 'sequelize'
import { InventoryPersistence } from './dto/inventory'
import type { IInventoryAdapter } from '../../interfaces/repository'
import { Inventory } from '../../model/inventory'

export class MysqlInventoryAdapter implements IInventoryAdapter {
  async list_all(productIds: string[]): Promise<Inventory[]> {
    const inventories = await InventoryPersistence.findAll({
      attributes: ['productId', 'quantity', 'status'],
      where: {
        productId: { [Op.in]: productIds }
      }
    })
    console.log(inventories)

    return inventories ? inventories.map((inv) => inv.get({ plain: true })) : []
  }

  async findByProductId(productId: string): Promise<Inventory> {
    const inventory = await InventoryPersistence.findOne({ where: { productId } })

    return inventory?.get({ plain: true })
  }
}
