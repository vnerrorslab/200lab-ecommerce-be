import type { User } from '../model/auth'

export interface IAuthRepository {
  insert(data: User): Promise<string>

  findById(id: string): Promise<User | null>

  findByEmail(email: string): Promise<User | null>
}
