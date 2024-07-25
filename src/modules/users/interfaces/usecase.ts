import type { Paging } from '../../../shared/dto/paging'
import type { CreateUserDTO } from '../infras/transport/dto/user_creation'
import type { UserDetailDTO } from '../infras/transport/dto/user_detail'
import type { UpdateUserDTO } from '../infras/transport/dto/user_update'
import type { User, UserListingConditionDTO } from '../model/user'

export interface IUserUseCase {
  createUser(dto: CreateUserDTO): Promise<boolean>

  updateUser(id: string, dto: UpdateUserDTO): Promise<boolean>

  deleteUser(id: string): Promise<boolean>

  listUsers(condition: UserListingConditionDTO, paging: Paging): Promise<{ users: User[]; total_pages: number }>

  getUserDetail(id: string): Promise<UserDetailDTO | null>
}
