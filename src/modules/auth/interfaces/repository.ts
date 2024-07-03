import type { User, UserPermission } from '../model/user'

export interface IAuthRepository {
  insert(data: User): Promise<string>

  findById(id: string): Promise<User | null>

  findByEmail(email: string): Promise<User | null>

  insertPermission(data: UserPermission): Promise<string>

  findPermissionsByUserId(userId: string): Promise<number>
}
