import { DataTypes, Model, type Sequelize } from 'sequelize'

export class InventoryPersistence extends Model {}

export function initInventory(sequelize: Sequelize) {
  InventoryPersistence.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      cost_price: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'out_of_stock'
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    },
    {
      sequelize,
      modelName: 'Inventory',
      timestamps: true,
      tableName: 'inventories'
    }
  )
}
