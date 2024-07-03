import type { LoginUserDTO } from '../infras/transport/dto/auth-login'
import type { InsertUserDTO } from '../infras/transport/dto/auth-register'

export interface IAuthUseCase {
  middlewareCheck(token: string): Promise<{ userId: string; role: string; actions: number }>

  register(dto: InsertUserDTO): Promise<boolean>

  login(dto: LoginUserDTO): Promise<string>
}
