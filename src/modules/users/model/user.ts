import type { UserStatus } from '../../../shared/dto/status'
import { Image } from './image'

export class User {
  constructor(
    readonly id: string,
    readonly first_name: string,
    readonly last_name: string,
    readonly email: string,
    readonly password: string,
    readonly salt: string,
    readonly phone: string,
    readonly address: string,
    readonly identification_card: string,
    readonly status: UserStatus,
    public image: Image | null
  ) {}
}

export class UserUpdateDTO {
  first_name?: string
  last_name?: string
  email?: string
  password?: string
  phone?: string
  address?: string
  identification_card?: string
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
