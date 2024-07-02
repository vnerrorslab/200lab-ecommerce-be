import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

import type { IAuthUseCase } from '../interfaces/usecase'
import type { IAuthRepository } from '../interfaces/repository'

import type { InsertUserDTO } from '../infras/transport/dto/auth-register'
import type { LoginUserDTO } from '../infras/transport/dto/auth-login'

import { User, UserPermission } from '../model/user'
import { ErrUserExists, ErrUserNotFound } from '../model/user.error'

import { generateRandomString } from '~/shared/utils/generateRandomString'
import type { ITokenService } from '~/shared/interfaces/token-service'

export class AuthUseCase implements IAuthUseCase {
  constructor(
    readonly authRepository: IAuthRepository,
    readonly tokenService: ITokenService
  ) {}

  async middlewareCheck(token: string): Promise<{ userId: string; role: string; actions: number }> {
    const userId = await this.tokenService.verifyToken(token)
    if (!userId) {
      throw new Error('Forbidden')
    }

    const user = await this.authRepository.findById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    const actions = await this.authRepository.findPermissionsByUserId(userId)

    return { userId: user.id, role: user.role, actions }
  }

  async register(dto: InsertUserDTO): Promise<boolean> {
    try {
      dto.validate()
    } catch (error: any) {
      throw new Error(error.message)
    }

    const user = await this.authRepository.findByEmail(dto.email)

    if (user) {
      throw ErrUserExists
    }

    const salt = generateRandomString(8)

    const password = dto.password + salt

    const hashedPassword = await bcrypt.hash(password, 10)

    const userId = uuidv4()

    const newUser = new User(userId, dto.firstName, dto.lastName, dto.email, hashedPassword, salt, 'active', dto.role)

    await this.authRepository.insert(newUser)

    const userActions = new UserPermission(uuidv4(), dto.actions, userId)

    await this.authRepository.insertPermission(userActions)

    return true
  }

  async login(dto: LoginUserDTO): Promise<string> {
    try {
      dto.validate()
    } catch (error: any) {
      throw new Error(error.message)
    }

    const user = await this.authRepository.findByEmail(dto.email)
    if (!user) {
      throw ErrUserNotFound
    }

    const isPasswordValid = await bcrypt.compare(dto.password + user.salt, user.password)
    if (!isPasswordValid) {
      throw new Error('Invalid password')
    }

    const token = await this.tokenService.generateToken(user.id)
    return token
  }
}
