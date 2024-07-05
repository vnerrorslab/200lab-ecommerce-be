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
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'product_id'
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      costPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'cost_price'
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'out_of_stock'
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at',
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updated_at',
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
