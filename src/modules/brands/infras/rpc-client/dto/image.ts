import { DataTypes, Model, type Sequelize } from 'sequelize'

export class ImagePersistence extends Model {}

export function initImages(sequelize: Sequelize) {
  ImagePersistence.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true
      },

      path: {
        type: DataTypes.STRING,
        allowNull: false
      },

      cloudName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'cloud_name'
      },

      width: {
        type: DataTypes.INTEGER,
        allowNull: true
      },

      height: {
        type: DataTypes.INTEGER,
        allowNull: true
      },

      size: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'Image',
      timestamps: true,
      tableName: 'images'
    }
  )
}
