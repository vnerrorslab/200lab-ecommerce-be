import { DataTypes, Model, type Sequelize } from 'sequelize'
import { ImageStatus } from '~/shared/dto/status'

export class ImagePersistence extends Model {}

export function initImages(sequelize: Sequelize) {
  ImagePersistence.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },

      path: {
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
        allowNull: false
      },

      status: {
        type: DataTypes.ENUM(ImageStatus.UPLOADED, ImageStatus.USED),
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
