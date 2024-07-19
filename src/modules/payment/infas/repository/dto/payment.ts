import { DataTypes, Model, type Sequelize } from 'sequelize'

export class PaymentPersistence extends Model {}

export function initPayment(sequelize: Sequelize) {
  PaymentPersistence.init(
    {
      orderId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'order_id'
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'user_id'
      },
      status: {
        type: DataTypes.ENUM('pending', 'success', 'failed'),
        defaultValue: 'pending'
      },
      appTransId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: 'app_trans_id'
      },
      paidAt: {
        type: DataTypes.DATE,
        field: 'paid_at',
        defaultValue: DataTypes.NOW
      },
      description: {
        type: DataTypes.STRING,
        defaultValue: null
      },
      discountAmount: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'discount_amount',
        defaultValue: null
      }
    },
    {
      sequelize,
      modelName: 'Payment',
      tableName: 'payment'
    }
  )
}
