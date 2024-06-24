import type { Paging } from '../../../shared/dto/paging'
import type { UserDetailDTO } from '../infras/transport/dto/user_detail'
import type { User, UserUpdateDTO, UserListingConditionDTO } from '../model/user'

export interface IUserRepository {
  insert(data: User): Promise<string>

  findById(id: string): Promise<User | null>

  findByEmail(email: string): Promise<User | null>

  list(condition: UserListingConditionDTO, paging: Paging): Promise<{ users: User[]; total_pages: number }>

  updateById(id: string, data: UserUpdateDTO): Promise<boolean>

  deleteById(id: string): Promise<boolean>

  findUserDetail(id: string): Promise<UserDetailDTO | null>
}
