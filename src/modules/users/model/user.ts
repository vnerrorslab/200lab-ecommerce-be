import type { UserStatus } from '../../../shared/dto/status'
import { Image } from './image'

export class User {
  constructor(
    readonly id: string,
    readonly firstName: string,
    readonly lastName: string,
    readonly email: string,
    readonly password: string,
    readonly salt: string,
    readonly phone: string,
    readonly address: string,
    readonly identificationCard: string,
    readonly status: UserStatus,
    public image: Image | null,
    readonly createdBy: string
  ) {}
}

export class UserUpdateDTO {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  phone?: string
  address?: string
  identificationCard?: string
  status?: UserStatus
}

export class UserListingConditionDTO {
  constructor(readonly searchStr: string) {}
}

export class UserChangeStatusDTO {
  constructor(
    readonly id: string,
    readonly status: string
  ) {}
}
