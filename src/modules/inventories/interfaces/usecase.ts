import type { InventoryCheckDTO } from '../infas/transport/dto/inventory_check'
import type { CreateInventoryDTO } from '../infas/transport/dto/inventory_create'
import type { UpdateInventoryDTO } from '../infas/transport/dto/inventory_update'
import type { Inventory } from '../model/inventory'

export interface IInventoryUseCase {
  listAllInventory(): Promise<Inventory[] | null>
  checkInventory(dto: InventoryCheckDTO[]): Promise<boolean>
  createInventory(dto: CreateInventoryDTO): Promise<string>
  updateInventory(id: string, dto: UpdateInventoryDTO): Promise<boolean>
}
