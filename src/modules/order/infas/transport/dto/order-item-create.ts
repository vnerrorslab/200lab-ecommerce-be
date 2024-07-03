import z from 'zod'

export class CreateOrderItemDTO {
  constructor(
    readonly productId: string,
    readonly productName: string,
    readonly unitPrice: number,
    readonly quantity: number
  ) {}

  validate(): void {
    const schema = z
      .object({
        productId: z.string(),
        productName: z.string(),
        unitPrice: z.number().min(0),
        quantity: z.number()
      })
      .required()

    try {
      schema.parse({
        productId: this.productId,
        productName: this.productName,
        quantity: this.quantity,
        unitPrice: this.unitPrice
      })
    } catch (error: any) {
      throw new Error(error.errors[0].message)
    }
  }
}
