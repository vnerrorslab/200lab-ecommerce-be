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
      phone: {
        type: DataTypes.STRING,
        allowNull: false
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true
      },
      identificationCard: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'identification_card'
      },
      status: {
        type: DataTypes.ENUM(UserStatus.ACTIVE, UserStatus.INACTIVE),
        allowNull: false
      },
      image: {
        type: DataTypes.JSON,
        allowNull: true
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'created_by'
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
