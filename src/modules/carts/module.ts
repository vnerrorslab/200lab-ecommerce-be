import { sequelize } from '~/infras/sequelize'
import { MySQLCartRepository } from './infras/repository/mysql_cart_repository'
import { MySQLProductRepository as MySQLProductRepositoryInCart } from './infras/rpc-client/mysql_product_repository'
import { CartService } from './infras/transport/rest/routes'
import { CartUseCase } from './usecase/cart_usecase'

export const cartService = new CartService(
  new CartUseCase(new MySQLCartRepository(sequelize), new MySQLProductRepositoryInCart())
)
