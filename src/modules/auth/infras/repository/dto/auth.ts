import { DataTypes, Model, type Sequelize } from 'sequelize'
import { Roles, UserStatus } from '~/shared/dto/status'
import { UserStatus } from '~/shared/dto/status'

export class AuthPersistence extends Model {}

export function initAuth(sequelize: Sequelize) {
  AuthPersistence.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'first_name'
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'last_name'
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      salt: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM(UserStatus.PENDING, UserStatus.ACTIVE, UserStatus.INACTIVE),
        allowNull: false
      },
      role: {
        type: DataTypes.ENUM(Roles.USER, Roles.ADMIN),
        allowNull: false,
        defaultValue: Roles.USER
      },
      actions: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0
      }
    },
    {
      sequelize,
      modelName: 'Auth',
      timestamps: true,
      tableName: 'users'
    }
  )
}
