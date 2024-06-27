export class Inventory {
  constructor(
    readonly id: string,
    readonly product_id: string,
    readonly quantity: number,
    readonly cost_price: number,
    readonly status: string,
    readonly created_at: Date,
    readonly updated_at: Date
  ) {}
}

export class InventorySearchDTO {
  constructor(readonly searchStr: string) {}
}

export class UpdateInventoryDTO {
  product_id?: string
  quantity?: number
  status?: string
  cost_price?: number
  updated_at?: Date
}
