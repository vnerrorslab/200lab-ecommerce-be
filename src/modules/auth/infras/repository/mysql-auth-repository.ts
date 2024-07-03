import { Sequelize } from 'sequelize'

import type { IAuthRepository } from '../../interfaces/repository'
import { User, UserPermission } from '../../model/user'
import { AuthPersistence } from './dto/auth'
import { UserPermissionPersistence } from './dto/user-permission'

export class MySQLAuthRepository implements IAuthRepository {
  constructor(readonly sequelize: Sequelize) {}

  async insert(data: User): Promise<string> {
    try {
      const userData = {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: data.role,
        salt: data.salt,
        status: data.status
      }

      const result = await AuthPersistence.create(userData)

      return result.getDataValue('id')
    } catch (error: any) {
      throw new Error(`Error inserting user: ${error.message}`)
    }
  }

  async findById(id: string): Promise<User | null> {
    const user = await AuthPersistence.findByPk(id)

    return user ? user.get({ plain: true }) : null
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await AuthPersistence.findOne({ where: { email } })

    return user ? user.get({ plain: true }) : null
  }

  async insertPermission(data: UserPermission): Promise<string> {
    try {
      const result = await UserPermissionPersistence.create({
        id: data.id,
        actions: data.actions,
        userId: data.userId
      })

      return result.getDataValue('id')
    } catch (error: any) {
      throw new Error(`Error inserting permission: ${error.message}`)
    }
  }

  async findPermissionsByUserId(userId: string): Promise<number> {
    const permission = await UserPermissionPersistence.findOne({ where: { userId } })
    return permission?.getDataValue('actions')
  }
}
