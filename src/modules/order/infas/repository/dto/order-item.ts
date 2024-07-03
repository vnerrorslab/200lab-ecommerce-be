import { DataTypes, Model, Sequelize } from 'sequelize'

export class OrderItemPersistence extends Model {}

export function initOrderItem(sequelize: Sequelize) {
  OrderItemPersistence.init(
    {
      orderId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        field: 'order_id'
      },
      productId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        field: 'product_id'
      },
      quantity: {
        type: DataTypes.SMALLINT,
        allowNull: false
      },
      unitPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'unit_price'
      }
    },
    {
      sequelize,
      modelName: 'OrderItem',
      tableName: 'order_items'
    }
  )
}
