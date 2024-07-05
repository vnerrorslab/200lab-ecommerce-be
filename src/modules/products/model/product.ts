import type { BaseStatus } from '~/shared/dto/status'
import { Image } from './image'
import { Brand } from './brand'
import { Category } from './category'

export class Product {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly images: Image[] | null,
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

export class ProductDetail {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly images: Image[] | null,
    readonly price: number,
    readonly quantity: number,
    readonly brand: Brand | null,
    readonly category: Category | null,
    readonly description: string,
    readonly status: BaseStatus,
    readonly createdBy: string,
    readonly updatedBy: string
  ) {}
}

export class ProductUpdateDTO {
  name?: string
  images?: string[]
  price?: number
  quantity?: number
  brandId?: string
  categoryId?: string
  description?: string
  status?: BaseStatus
  createdBy?: string
  updatedBy?: string
}

export class ProductListingConditionDTO {
  constructor(readonly searchStr: string) {}
}

export class ProductChangeStatusDTO {
  constructor(
    readonly id: string,
    readonly status: string
  ) {}
}
