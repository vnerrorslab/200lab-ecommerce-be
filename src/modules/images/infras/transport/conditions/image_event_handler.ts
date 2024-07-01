import { IImageUseCase } from '~/modules/images/interfaces/usecase'
import { ImageStatus } from '~/shared/dto/status'
import { USING_IMAGE, UsingImageEvent, sharedEventEmitter } from '~/shared/utils/event-emitter'

export class ImageEventHandler {
  constructor(readonly imageUseCase: IImageUseCase) {
    this.initialize()
  }

  initialize() {
    sharedEventEmitter.on(USING_IMAGE, this.handleUsingImage.bind(this))
  }

  async handleUsingImage({ image_id }: UsingImageEvent) {
    await this.changeImageStatus(image_id, ImageStatus.USED)
  }

  async changeImageStatus(image_id: string, status: string) {
    await this.imageUseCase.changeStatus(image_id, status)
  }
}
