import { DataTypes, Model, type Sequelize } from 'sequelize'
import { UserStatus } from '../../../../../shared/dto/status'

export class UserPersistence extends Model {}

export function initUsers(sequelize: Sequelize) {
  UserPersistence.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false
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
      phone: {
        type: DataTypes.STRING,
        allowNull: false
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true
      },
      identification_card: {
        type: DataTypes.STRING,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM(UserStatus.ACTIVE, UserStatus.INACTIVE),
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'User',
      timestamps: true,
      tableName: 'users'
    }
  )
}
