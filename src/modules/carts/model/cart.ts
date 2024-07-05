import { ProductDetail } from './product'

export class Cart {
  constructor(
    readonly id: string,
    readonly productId: string,
    readonly quantity: number,
    readonly createdBy: string
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
