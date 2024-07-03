import { sequelize } from '~/infras/sequelize'
import { MySQLAuthRepository } from './infras/repository/mysql-auth-repository'
import { AuthService } from './infras/transport/rest/routes'
import { AuthUseCase } from './usecase/auth-usecase'
import { JwtTokenService } from '~/shared/token/jwt-token-service'

const tokenService = new JwtTokenService(process.env.JWT_SECRET_KEY || '200', '1h')
export const authService = new AuthService(new AuthUseCase(new MySQLAuthRepository(sequelize), tokenService))
