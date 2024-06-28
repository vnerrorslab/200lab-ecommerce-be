import { IImageUploader } from '~/modules/images/interfaces/usecase'

export class LocalUploader implements IImageUploader {
  constructor() {}

  async uploadImage(filename: string, filesize: number, contentType: string): Promise<boolean> {
    return true
  }

  cloudName(): string {
    return 'local'
  }
}
