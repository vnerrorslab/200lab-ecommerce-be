import { sequelize } from '~/infras/sequelize'
import { MySQLImagesRepository } from './infras/repository/mysql_image_repository'
import { ImageService } from './infras/transport/rest/routes'
import { ImageUseCase } from './usecase/image_usecase'
import { S3Uploader } from './infras/repository/uploader/s3_uploader'
import { S3Deleter } from './infras/repository/delete/s3_deleter'

export const imageService = new ImageService(
  new ImageUseCase(new MySQLImagesRepository(sequelize), new S3Uploader(), new S3Deleter())
)
