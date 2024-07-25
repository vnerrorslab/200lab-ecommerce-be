import { z } from 'zod'
import { ErrPriceEmpty, ErrProductIdEmpty } from '~/shared/error'

export class UpdateInventoryDTO {
  constructor(
    readonly productId: string,
    readonly quantity: number,
    readonly costPrice: number,
    readonly status: string,
    readonly updatedAt: Date
  ) {}

  validate(): void {
    const schema = z.object({
      productId: z.string().min(1, { message: ErrProductIdEmpty.message }),
      quantity: z.number().int().min(0),
      costPrice: z.number().min(0, { message: ErrPriceEmpty.message }),
      updatedAt: z.date()
    })

    try {
      schema.parse({
        productId: this.productId,
        quantity: this.quantity,
        costPrice: this.costPrice,
        status: this.status,
        updatedAt: this.updatedAt
      })
    } catch (error: any) {
      throw new Error(error.errors[0].message)
    }
  }
}
