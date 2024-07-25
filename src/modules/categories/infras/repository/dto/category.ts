import { DataTypes, Model, type Sequelize } from 'sequelize'
import { BaseStatus } from '~/shared/dto/status'

export class CategoryPersistence extends Model {}

export function initCategories(sequelize: Sequelize) {
  CategoryPersistence.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false
      },

      description: {
        type: DataTypes.STRING,
        allowNull: true
      },

      status: {
        type: DataTypes.ENUM(BaseStatus.ACTIVE, BaseStatus.INACTIVE),
        allowNull: false
      },

      parentId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'parent_id'
      },

      updatedBy: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'updated_by'
      },

      createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'created_by'
      }
    },
    {
      sequelize,
      modelName: 'Category',
      timestamps: true,
      tableName: 'categories'
    }
  )
}
