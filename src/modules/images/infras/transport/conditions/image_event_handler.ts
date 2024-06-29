import { IImageUseCase } from '~/modules/images/interfaces/usecase'
import { ImageStatus } from '~/shared/dto/status'
import { USER_USING_IMAGE, UserUsingImageEvent, userEventEmitter } from '~/shared/utils/event-emitter'

export class ImageEventHandler {
  constructor(readonly imageUseCase: IImageUseCase) {
    this.initialize()
  }

  initialize() {
    userEventEmitter.on(USER_USING_IMAGE, this.handleUserUsingImage.bind(this))
  }

  async handleUserUsingImage({ image_id }: UserUsingImageEvent) {
    await this.changeImageStatus(image_id, ImageStatus.USED)
  }

  async changeImageStatus(image_id: string, status: string) {
    await this.imageUseCase.changeStatus(image_id, status)
  }
}
