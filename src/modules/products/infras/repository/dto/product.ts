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

      image_url: {
        type: DataTypes.STRING,
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

      brand_id: {
        type: DataTypes.UUID,
        allowNull: false
      },

      category_id: {
        type: DataTypes.UUID,
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

      created_by: {
        type: DataTypes.STRING,
        allowNull: false
      },

      updated_by: {
        type: DataTypes.STRING,
        allowNull: false
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
