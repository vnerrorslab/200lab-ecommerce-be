import { DataTypes, Model, type Sequelize } from 'sequelize'

export class UserPermissionPersistence extends Model {}

export function initPermission(sequelize: Sequelize) {
  UserPermissionPersistence.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      actions: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'user_id'
      }
    },
    {
      sequelize,
      modelName: 'Permission',
      timestamps: true,
      tableName: 'permissions'
    }
  )
}
