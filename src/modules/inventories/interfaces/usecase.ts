import { Paging } from '~/shared/dto/paging'
import type { InventoryCheckDTO } from '../infas/transport/dto/inventory_check'
import type { CreateInventoryDTO } from '../infas/transport/dto/inventory_create'
import type { UpdateInventoryDTO } from '../infas/transport/dto/inventory_update'
import type { Inventory, InventorySearchDTO } from '../model/inventory'

export interface IInventoryUseCase {
  listAllInventory(
    condition: InventorySearchDTO,
    paging: Paging
  ): Promise<{ inventories: Inventory[]; total_pages: number }>
  checkInventory(dto: InventoryCheckDTO[]): Promise<boolean | void>
  createInventory(dto: CreateInventoryDTO): Promise<string>
  updateInventory(id: string, dto: UpdateInventoryDTO): Promise<boolean>
}
