import { DataTypes, Model, Sequelize } from 'sequelize'
import { OrderStatus, PaymentStatus } from '~/shared/dto/status'

export class OrderPersistence extends Model {}

export function initOrder(sequelize: Sequelize) {
  OrderPersistence.init(
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'user_id'
      },
      orderStatus: {
        type: DataTypes.ENUM(
          OrderStatus.PENDING,
          OrderStatus.CONFIRMED,
          OrderStatus.PROCESSING,
          OrderStatus.SHIPPING,
          OrderStatus.DELIVERED,
          OrderStatus.COMPLETED,
          OrderStatus.CANCELLED,
          OrderStatus.REFUNDED
        ),
        allowNull: false,
        defaultValue: OrderStatus.PENDING,
        field: 'order_status'
      },
      shippingAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
        field: 'shipping_address'
      },
      shippingMethod: {
        type: DataTypes.STRING,
        defaultValue: '',
        field: 'shipping_method'
      },
      paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'COD',
        field: 'payment_method'
      },
      paymentStatus: {
        type: DataTypes.ENUM(PaymentStatus.PENDING, PaymentStatus.SUCCESS, PaymentStatus.FAILED),
        allowNull: false,
        defaultValue: PaymentStatus.PENDING,
        field: 'payment_status'
      },
      trackingNumber: {
        type: DataTypes.STRING,
        field: 'tracking_number'
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at'
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at'
      }
    },
    {
      sequelize,
      modelName: 'Order',
      tableName: 'orders'
    }
  )
}
