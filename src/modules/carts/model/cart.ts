export class Cart {
  constructor(
    readonly id: string,
    readonly product_id: string,
    readonly quantity: number,
    readonly unit_price: number,
    readonly created_by: string
  ) {}
}

export class CartUpdateDTO {
  constructor(readonly quantity: number) {}
}

export class CartListingConditionDTO {
  constructor(
    readonly searchStr: string,
    readonly id: string
  ) {}
}

export class CartDeleteDTO {
  constructor(readonly id: string) {}
}
