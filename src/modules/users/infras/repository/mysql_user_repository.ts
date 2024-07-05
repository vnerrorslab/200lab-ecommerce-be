import { Sequelize, Op, type WhereOptions } from 'sequelize'

import type { Paging } from '~/shared/dto/paging'
import type { IUserRepository } from '../../interfaces/repository'
import { User } from '../../model/user'
import { UserUpdateDTO, UserListingConditionDTO } from '../../model/user'
import { UserPersistence } from './dto/user'
import type { UserDetailDTO } from '../transport/dto/user_detail'
import { UserStatus } from '~/shared/dto/status'

export class MySQLUserRepository implements IUserRepository {
  constructor(readonly sequelize: Sequelize) {}

  async insert(data: User): Promise<string> {
    try {
      const userData = {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        salt: data.salt,
        phone: data.phone,
        address: data.address,
        identificationCard: data.identificationCard,
        status: data.status,
        image: data.image
      }

      const result = await UserPersistence.create(userData)

      return result.getDataValue('id')
    } catch (error: any) {
      throw new Error(`Error inserting user: ${error.message}`)
    }
  }

  async findById(id: string): Promise<User | null> {
    const user = await UserPersistence.findByPk(id)

    return user ? user.get({ plain: true }) : null
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserPersistence.findOne({ where: { email } })

    return user ? user.get({ plain: true }) : null
  }

  async list(condition: UserListingConditionDTO, paging: Paging): Promise<{ users: User[]; total_pages: number }> {
    try {
      let whereClause: WhereOptions = {}

      if (condition.searchStr) {
        whereClause = {
          ...whereClause,
          [Op.or]: [
            { firstName: { [Op.like]: `%${condition.searchStr}%` } },
            { lastName: { [Op.like]: `%${condition.searchStr}%` } },
            { email: { [Op.like]: `%${condition.searchStr}%` } }
          ]
        }
      }

      const { rows: users, count: total_pages } = await UserPersistence.findAndCountAll({
        where: whereClause,
        limit: paging.limit,
        offset: (paging.page - 1) * paging.limit
      })

      return {
        users: users.map((user) => user.get({ plain: true })),
        total_pages
      }
    } catch (error: any) {
      throw new Error(`Error listing users: ${error.message}`)
    }
  }

  async updateById(id: string, data: UserUpdateDTO): Promise<boolean> {
    try {
      const [affectedCount] = await UserPersistence.update(data, { where: { id } })
      return affectedCount > 0
    } catch (error: any) {
      throw new Error(`Error updating user: ${error.message}`)
    }
  }

  async deleteById(id: string): Promise<boolean> {
    try {
      const result = await UserPersistence.update(
        { status: UserStatus.INACTIVE },

        { where: { id } }
      )

      return result[0] > 0
    } catch (error: any) {
      throw new Error(`Error deleting user: ${error.message}`)
    }
  }

  async findUserDetail(id: string): Promise<UserDetailDTO | null> {
    const user = await UserPersistence.findByPk(id, {
      attributes: ['id', 'image', 'firstName', 'lastName', 'email', 'phone', 'address', 'identificationCard', 'status']
    })

    if (!user) return null

    return user ? user.get({ plain: true }) : null
  }
}
