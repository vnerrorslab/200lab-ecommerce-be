import { BaseStatus } from '~/shared/dto/status'
import type { InventoryCheckDTO } from '../infas/transport/dto/inventory_check'
import type { CreateInventoryDTO } from '../infas/transport/dto/inventory_create'
import type { UpdateInventoryDTO } from '../infas/transport/dto/inventory_update'
import type { IInventoryRepository } from '../interfaces/repository'
import type { IInventoryUseCase } from '../interfaces/usecase'
import type { Inventory } from '../model/inventory'
import { v4 as uuidv4 } from 'uuid'

export class InventoryUseCase implements IInventoryUseCase {
  constructor(readonly inventoryRepository: IInventoryRepository) {}
  async createInventory(dto: CreateInventoryDTO): Promise<string> {
    try {
      dto.validate()
    } catch (error: any) {
      throw new Error(error.message)
    }

    const create_inv = {
      id: uuidv4(),
      product_id: dto.product_id,
      quantity: dto.quantity,
      cost_price: dto.cost_price,
      status: dto.status,
      created_at: dto.created_at,
      updated_at: dto.updated_at
    }
    const inventory = await this.inventoryRepository.save(create_inv)

    return inventory ? create_inv.id : ''
  }

  async updateInventory(id: string, dto: UpdateInventoryDTO): Promise<boolean> {
    try {
      dto.validate()
    } catch (error: any) {
      throw new Error(error.message)
    }

    const inventory = await this.inventoryRepository.findById(id)

    if (!inventory) {
      throw new Error('Inventory not found!')
    }

    const update_inventory = {
      ...inventory,
      product_id: dto.product_id || inventory.product_id,
      quantity: dto.quantity || inventory.quantity,
      status: dto.status || inventory.status,
      cost_price: dto.cost_price || inventory.cost_price,
      updated_at: dto.updated_at || inventory.updated_at
    }

    const result = await this.inventoryRepository.update(id, update_inventory)
    return result ? true : false
  }

  async listAllInventory(): Promise<Inventory[] | null> {
    const result = await this.inventoryRepository.list_all()
    return result ? result : null
  }

  async checkInventory(dto: InventoryCheckDTO[]): Promise<boolean> {
    const inventory = (await this.inventoryRepository.list_all()) || null

    const inventoryMap = new Map()
    if (inventory) {
      for (const item of inventory) {
        inventoryMap.set(item.product_id, { quantity: item.quantity, status: item.status })
      }
    }

    for (const item of dto) {
      const productInfo = inventoryMap.get(item.product_id) || { quantity: 0, status: BaseStatus.OUTOFSTOCK }

      if (item.quantity > productInfo.quantity || productInfo.status === BaseStatus.OUTOFSTOCK) {
        return false
      }
    }

    return true
  }
}
