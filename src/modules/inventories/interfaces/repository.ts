import type { Inventory, InventorySearchDTO, UpdateInventoryDTO } from '../model/inventory'
import type { Paging } from '../../../shared/dto/paging'

export interface IInventoryRepository {
  list_paginate(
    condition: InventorySearchDTO,
    paging: Paging
  ): Promise<{ inventories: Inventory[]; total_pages: number }>

  list_all(productIds: string[]): Promise<Inventory[]>

  findByProductId(productId: string): Promise<Inventory>

  findById(id: string): Promise<Inventory | null>

  save(data: Inventory): Promise<string>

  update(id: string, data: UpdateInventoryDTO): Promise<boolean>
}
