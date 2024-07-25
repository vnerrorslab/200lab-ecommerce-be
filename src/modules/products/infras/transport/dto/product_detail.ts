import { Image } from '~/modules/products/model/image'
import type { BaseStatus } from '~/shared/dto/status'

export class ProductDetailDTO {
  constructor(
    readonly id: string,
    readonly name: string,
    public images: Image[] | null,
    readonly price: number,
    readonly quantity: number,
    readonly brandId: string,
    readonly categoryId: string,
    readonly description: string,
    readonly status: BaseStatus,
    readonly createdBy: string,
    readonly updatedBy: string
  ) {}
}
