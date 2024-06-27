import { z } from 'zod'
import { ErrPriceEmpty, ErrProductIdEmpty } from '~/shared/error'

export class UpdateInventoryDTO {
  constructor(
    readonly product_id: string,
    readonly quantity: number,
    readonly status: string,
    readonly cost_price: number,
    readonly updated_at: Date
  ) {}

  validate(): void {
    const schema = z.object({
      product_id: z.string().min(1, { message: ErrProductIdEmpty.message }),
      quantity: z.number().int().min(0),
      cost_price: z.number().min(0, { message: ErrPriceEmpty.message }),
      updated_at: z.date()
    })

    try {
      schema.parse({
        product_id: this.product_id,
        quantity: this.quantity,
        status: this.status,
        cost_price: this.cost_price,
        updated_at: this.updated_at
      })
    } catch (error: any) {
      throw new Error(error.errors[0].message)
    }
  }
}
