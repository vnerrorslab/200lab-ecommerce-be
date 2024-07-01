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

      cloud_name: {
        type: DataTypes.STRING,
        allowNull: false
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
