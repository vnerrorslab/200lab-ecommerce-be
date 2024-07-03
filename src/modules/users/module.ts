import { sequelize } from '~/infras/sequelize'
import { MySQLUserRepository } from './infras/repository/mysql_user_repository'
import { UserService } from './infras/transport/rest/routes'
import { UserUseCase } from './usecase/user_usecase'
import { MySQLImageRepository as MySQLImageInUserRepository } from './infras/rpc-client/mysql_image_repository'

export const userService = new UserService(
  new UserUseCase(new MySQLUserRepository(sequelize), new MySQLImageInUserRepository(sequelize))
)
