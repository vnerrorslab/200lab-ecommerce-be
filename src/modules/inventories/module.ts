import { sequelize } from '~/infras/sequelize'
import { MysqlInventoryRepository } from './infas/repository/mysql_inventory_repository'
import { InventoryService } from './infas/transport/rest/routes'
import { InventoryUseCase } from './usecase/inventory-usecase'

export const inventoryService = new InventoryService(new InventoryUseCase(new MysqlInventoryRepository()))
