import { BaseStatus } from '~/shared/dto/status'
import { Brand } from './brand'
import { Category } from './category'
import { Image } from './image'

export class ProductDetail {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly images: Image[] | null,
    readonly price: number,
    readonly quantity: number,
    readonly brand: Brand | null,
    readonly category: Category | null,
    readonly status: BaseStatus,
    readonly created_by: string,
    readonly updated_by: string
  ) {}
}
