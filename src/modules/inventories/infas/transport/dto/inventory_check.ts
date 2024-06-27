export class InventoryCheckDTO {
  constructor(
    readonly product_id: string,
    readonly quantity: number
  ) {}
}
