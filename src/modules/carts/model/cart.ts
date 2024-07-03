import { ProductDetail } from './product'

export class Cart {
  constructor(
    readonly id: string,
    readonly product_id: string,
    readonly quantity: number,
    readonly created_by: string
  ) {}
}

export class CartUpdateDTO {
  constructor(readonly quantity: number) {}
}

export class CartListingConditionDTO {
  constructor(readonly userId: string) {}
}

export class CartDeleteDTO {
  constructor(readonly id: string) {}
}
