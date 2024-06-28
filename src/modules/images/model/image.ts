import type { ImageStatus } from '~/shared/dto/status'

export class Image {
  constructor(
    readonly id: string,
    readonly path: string,
    readonly cloud_name: string,
    readonly width: number,
    readonly height: number,
    readonly size: number,
    readonly status: ImageStatus
  ) {}
}
