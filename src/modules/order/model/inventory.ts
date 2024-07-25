export class Inventory {
  constructor(
    readonly id: string,
    readonly productId: string,
    readonly quantity: number,
    readonly costPrice: number,
    readonly status: string,
    readonly createdAt: Date,
    readonly updatedAt: Date
  ) {}
}
