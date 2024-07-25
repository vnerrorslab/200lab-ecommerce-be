import { BaseStatus } from '~/shared/dto/status'
import { Image } from './image'

export class ProductDetail {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly images: Image[] | null,
    readonly price: number,
    readonly quantity: number,
    readonly status: BaseStatus,
    readonly createdBy: string,
    readonly updatedBy: string
  ) {}
}
