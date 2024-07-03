import { sequelize } from '~/infras/sequelize'
import { MySQLBrandRepository } from './infras/repository/mysql_brand_repository'
import { MySQLImageRepository as MySQLImageInBrandRepository } from './infras/rpc-client/mysql_image_repository'
import { BrandService } from './infras/transport/rest/routes'
import { BrandUseCase } from './usecase/brand_usecase'

export const brandService = new BrandService(
  new BrandUseCase(new MySQLBrandRepository(sequelize), new MySQLImageInBrandRepository(sequelize))
)
