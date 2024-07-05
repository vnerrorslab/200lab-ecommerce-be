export class InventoryCheckDTO {
  constructor(
    readonly productId: string,
    readonly quantity: number
  ) {}
}
