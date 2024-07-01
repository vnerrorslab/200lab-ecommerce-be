import { Image } from '~/modules/users/model/image'
import type { UserStatus } from '../../../../../shared/dto/status'

export class UserDetailDTO {
  constructor(
    readonly id: string,
    readonly first_name: string,
    readonly last_name: string,
    readonly email: string,
    readonly phone: string,
    readonly address: string,
    readonly identification_card: string,
    readonly status: UserStatus,
    public image: Image | null
  ) {}
}
