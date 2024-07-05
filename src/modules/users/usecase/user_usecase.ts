import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

import { User, UserListingConditionDTO } from '../model/user'
import { ErrEmailExists, ErrUserExists, ErrUserInActive, ErrUserNotFound } from '../model/user.error'
import type { IImageRepository, IUserRepository } from '../interfaces/repository'
import type { IUserUseCase } from '../interfaces/usecase'
import type { CreateUserDTO } from '../infras/transport/dto/user_creation'
import type { UpdateUserDTO } from '../infras/transport/dto/user_update'
import { Paging } from '../../../shared/dto/paging'
import { generateRandomString } from '../../../shared/utils/generateRandomString'
import type { UserDetailDTO } from '../infras/transport/dto/user_detail'
import { UserStatus } from '../../../shared/dto/status'
import { USING_IMAGE, sharedEventEmitter } from '~/shared/utils/event-emitter'

export class UserUseCase implements IUserUseCase {
  constructor(
    readonly userRepository: IUserRepository,
    readonly imageRepo: IImageRepository
  ) {}

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

    const userId = uuidv4()

    const salt = generateRandomString(8)
    const password = dto.password + salt
    const hashedPassword = await bcrypt.hash(password, 10)

    // get image from image id
    const image = await this.imageRepo.findById(dto.imageId)

    const newUser = new User(
      userId,
      dto.firstName,
      dto.lastName,
      dto.email,
      hashedPassword,
      salt,
      dto.phone,
      dto.address,
      dto.identificationCard,
      UserStatus.ACTIVE,
      image,
      dto.createdBy
    )

    await this.userRepository.insert(newUser)

    sharedEventEmitter.emit(USING_IMAGE, { imageId: dto.imageId })

    return true
  }

  async updateUser(id: string, dto: UpdateUserDTO): Promise<boolean> {
    try {
      dto.validate()
    } catch (error: any) {
      throw new Error(error.message)
    }

    //check user
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw ErrUserNotFound
    }

    //check email
    if (dto.email && dto.email !== user.email) {
      const userEmailExist = await this.userRepository.findByEmail(dto.email)

      if (userEmailExist && userEmailExist.id !== id) {
        throw ErrEmailExists
      }
    }

    const updatedUser = {
      ...user,
      firstName: dto.firstName ?? user.firstName,
      lastName: dto.lastName ?? user.lastName,
      email: dto.email ?? user.email,
      password: user.password,
      phone: dto.phone ?? user.phone,
      address: dto.address ?? user.address,
      identificationCard: dto.identificationCard ?? user.identificationCard,
      status: dto.status ?? user.status
    }

    if (dto.password) {
      const salt = generateRandomString(8)
      updatedUser.salt = salt

      const hashPassword = dto.password + salt
      updatedUser.password = await bcrypt.hash(hashPassword, 10)
    }

    await this.userRepository.updateById(id, updatedUser)

    return true
  }

  async deleteUser(id: string): Promise<boolean> {
    const user = await this.userRepository.findById(id)

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
