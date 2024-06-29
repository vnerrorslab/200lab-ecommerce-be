import cron from 'node-cron'
import { Op } from 'sequelize'
import { IImageRepository } from '../interfaces/repository'
import { IImageUseCase } from '../interfaces/usecase'

export class ImageCleanupScheduler {
  constructor(
    readonly imageRepository: IImageRepository,
    readonly imageUseCase: IImageUseCase
  ) {
    this.scheduleImageCleanup()
  }

  private scheduleImageCleanup() {
    cron.schedule('0 0 * * *', async () => {
      console.log('Running cleanup')

      const oneMonthAgo = new Date()
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

      //   const oneMinuteAgo = new Date(Date.now() - 60000)

      const imagesToDelete = await this.imageRepository.findAll({
        where: {
          status: 'uploaded',
          createdAt: {
            [Op.lte]: oneMonthAgo
            // [Op.lte]: oneMinuteAgo
          }
        }
      })

      for (const image of imagesToDelete) {
        await this.imageUseCase.deleteImage(image.path)
      }

      console.log('Clean rồi đó')
    })
  }
}
