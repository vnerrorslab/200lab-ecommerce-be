import { MysqlOrderRepository } from './infas/repository/mysql-order-repository'
import { MysqlInventoryAdapter } from './infas/rpc-client/mysql_inventory_repository'
import { OrderService } from './infas/transport/rest/routes'
import { OrderUseCase } from './usecase/order-usecase'

export const orderService = new OrderService(new OrderUseCase(new MysqlOrderRepository(), new MysqlInventoryAdapter()))
