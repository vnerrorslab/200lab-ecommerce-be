import { DataTypes, Model, type Sequelize } from 'sequelize'
import { BaseStatus } from '~/shared/dto/status'

export class ProductPersistence extends Model {}

export function initProducts(sequelize: Sequelize) {
  ProductPersistence.init(
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

      images: {
        type: DataTypes.JSON,
        allowNull: false
      },

      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },

      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      brandId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'brand_id'
      },

      categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'category_id'
      },

      description: {
        type: DataTypes.STRING,
        allowNull: true
      },

      status: {
        type: DataTypes.ENUM(BaseStatus.ACTIVE, BaseStatus.INACTIVE),
        allowNull: false
      },

      createdBy: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'created_by'
      },

      updatedBy: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'updated_by'
      }
    },
    {
      sequelize,
      modelName: 'Product',
      timestamps: true,
      tableName: 'products'
    }
  )
}
