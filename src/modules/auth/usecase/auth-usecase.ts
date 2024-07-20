import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'

import type { IAuthRepository } from '../interfaces/repository'
import type { IAuthUseCase } from '../interfaces/usecase'

import type { LoginUserDTO } from '../infras/transport/dto/auth-login'
import type { InsertUserDTO } from '../infras/transport/dto/auth-register'

import { User } from '../model/auth'
import { ErrUserExists, ErrUserNotFound } from '../model/auth.error'

import type { ITokenService } from '~/shared/interfaces/token-service'
import { generateRandomString } from '~/shared/utils/generateRandomString'
import { UserStatus } from '~/shared/dto/status'

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

    return { userId: user.id, role: user.role, actions: user.actions }
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

    const newUser = new User(
      userId,
      dto.firstName,
      dto.lastName,
      dto.email,
      hashedPassword,
      salt,
      UserStatus.ACTIVE,
      dto.role,
      dto.actions
    )

    await this.authRepository.insert(newUser)

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
