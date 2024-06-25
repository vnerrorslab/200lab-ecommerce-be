import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

import { User, UserListingConditionDTO } from '../model/user'
import { ErrEmailExists, ErrUserExists, ErrUserInActive, ErrUserNotFound } from '../model/user.error'
import type { IUserRepository } from '../interfaces/repository'
import type { IUserUseCase } from '../interfaces/usecase'
import type { CreateUserDTO } from '../infras/transport/dto/user_creation'
import type { UpdateUserDTO } from '../infras/transport/dto/user_update'
import { Paging } from '../../../shared/dto/paging'
import { generateRandomString } from '../../../shared/utils/generateRandomString'
import type { UserDetailDTO } from '../infras/transport/dto/user_detail'
import { UserStatus } from '../../../shared/dto/status'

export class UserUseCase implements IUserUseCase {
  constructor(readonly userRepository: IUserRepository) {}

  async createUser(dto: CreateUserDTO): Promise<boolean> {
    try {
      dto.validate()
    } catch (error: any) {
      throw new Error(error.message)
    }

    const user = await this.userRepository.findByEmail(dto.email)

    if (user) {
      throw ErrUserExists
    }

    let userId = uuidv4()

    let salt = generateRandomString(8)
    let password = dto.password + salt
    let hashedPassword = await bcrypt.hash(password, 10)

    let newUser = new User(
      userId,
      dto.first_name,
      dto.last_name,
      dto.email,
      hashedPassword,
      salt,
      dto.phone,
      dto.address,
      dto.identification_card,
      UserStatus.ACTIVE
    )

    await this.userRepository.insert(newUser)

    return true
  }

  async updateUser(id: string, dto: UpdateUserDTO): Promise<boolean> {
    try {
      dto.validate()
    } catch (error: any) {
      throw new Error(error.message)
    }

    //check user
    let user = await this.userRepository.findById(id)
    if (!user) {
      throw ErrUserNotFound
    }

    //check email
    if (dto.email && dto.email !== user.email) {
      let userEmailExist = await this.userRepository.findByEmail(dto.email)

      if (userEmailExist && userEmailExist.id !== id) {
        throw ErrEmailExists
      }
    }

    const updatedUser = {
      ...user,
      first_name: dto.first_name ?? user.first_name,
      last_name: dto.last_name ?? user.last_name,
      email: dto.email ?? user.email,
      password: user.password,
      phone: dto.phone ?? user.phone,
      address: dto.address ?? user.address,
      identification_card: dto.identification_card ?? user.identification_card,
      status: dto.status ?? user.status
    }

    if (dto.password) {
      let salt = generateRandomString(8)
      updatedUser.salt = salt

      let hashPassword = dto.password + salt
      updatedUser.password = await bcrypt.hash(hashPassword, 10)
    }

    await this.userRepository.updateById(id, updatedUser)

    return true
  }

  async deleteUser(id: string): Promise<boolean> {
    let user = await this.userRepository.findById(id)

    if (!user) {
      throw ErrUserNotFound
    }

    if (user.status === UserStatus.INACTIVE) {
      throw ErrUserInActive
    }

    await this.userRepository.deleteById(id)

    return true
  }

  async listUsers(condition: UserListingConditionDTO, paging: Paging): Promise<{ users: User[]; total_pages: number }> {
    return await this.userRepository.list(condition, paging)
  }

  async getUserDetail(id: string): Promise<UserDetailDTO | null> {
    return await this.userRepository.findUserDetail(id)
  }
}
