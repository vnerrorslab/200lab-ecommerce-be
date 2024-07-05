import { DataTypes, Model, type Sequelize } from 'sequelize'

export class CartPersistence extends Model {}

export function initCarts(sequelize: Sequelize) {
  CartPersistence.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'product_id'
      },
      quantity: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'created_by'
      }
    },
    {
      sequelize,
      modelName: 'Cart',
      timestamps: true,
      tableName: 'carts'
    }
  )
}
