import { ImageStatus } from '~/shared/dto/status'

export class ImageDetailDTO {
  constructor(
    readonly id: string,
    readonly path: string,
    readonly width: number,
    readonly height: number,
    readonly size: number,
    readonly status: ImageStatus
  ) {}
}
