import { Image } from '~/modules/users/model/image'
import type { UserStatus } from '../../../../../shared/dto/status'

export class UserDetailDTO {
  constructor(
    readonly id: string,
    readonly firstName: string,
    readonly lastName: string,
    readonly email: string,
    readonly phone: string,
    readonly address: string,
    readonly identificationCard: string,
    readonly status: UserStatus,
    public image: Image | null
  ) {}
}
