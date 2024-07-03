import { sequelize } from '~/infras/sequelize'
import { MySQLCategoryRepository } from './infras/repository/mysql_category_repository'
import { CategoryService } from './infras/transport/rest/routes'
import { CategoryUseCase } from './usecase/category_usecase'

export const categoryService = new CategoryService(new CategoryUseCase(new MySQLCategoryRepository(sequelize)))
