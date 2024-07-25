import { Image } from '~/modules/brands/model/image'
import { BaseStatus } from '~/shared/dto/status'

export class BrandDetailDTO {
  constructor(
    readonly id: string,
    readonly name: string,
    public image: Image | null,
    readonly tagLine: string,
    readonly description: string,
    readonly status: BaseStatus
  ) {}
}
