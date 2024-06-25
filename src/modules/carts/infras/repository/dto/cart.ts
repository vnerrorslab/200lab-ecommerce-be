import { DataTypes, Model, type Sequelize } from 'sequelize'

export class CartPersistence extends Model {}

export function initCarts(sequelize: Sequelize) {
  CartPersistence.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true
      },
      product_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      quantity: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      unit_price: {
        type: DataTypes.DECIMAL,
        allowNull: false
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: false
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
