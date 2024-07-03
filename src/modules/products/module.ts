import { sequelize } from '~/infras/sequelize'
import { MySQLProductsRepository } from './infras/repository/mysql_product_repository'
import { ProductService } from './infras/transport/rest/routes'
import { ProductUseCase } from './usecase/product_usecase'
import { MySQLImagesRepository as MySQLImagesInProductRepository } from './infras/rpc-client/mysql_images_repository'
import { MySQLBrandRepository as MySQLBrandInProductRepository } from './infras/rpc-client/mysql_brand_repository'
import { MySQLCategoryRepository as MySQLCategoryInProductRepository } from './infras/rpc-client/mysql_category_repository'

export const productService = new ProductService(
  new ProductUseCase(
    new MySQLProductsRepository(sequelize),
    new MySQLImagesInProductRepository(sequelize),
    new MySQLBrandInProductRepository(sequelize),
    new MySQLCategoryInProductRepository()
  )
)
