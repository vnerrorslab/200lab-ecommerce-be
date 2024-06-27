import { z } from 'zod'
import { ErrPriceEmpty, ErrProductIdEmpty } from '~/shared/error'

export class CreateInventoryDTO {
  constructor(
    readonly product_id: string,
    readonly quantity: number,
    readonly cost_price: number,
    readonly status: string,
    readonly created_at: Date,
    readonly updated_at: Date
  ) {}

  validate(): void {
    const schema = z.object({
      product_id: z.string().min(1, { message: ErrProductIdEmpty.message }),
      quantity: z.number().int().min(0),
      cost_price: z.number().min(0, { message: ErrPriceEmpty.message }),
      created_at: z.date(),
      updated_at: z.date()
    })

    try {
      schema.parse({
        product_id: this.product_id,
        quantity: this.quantity,
        cost_price: this.cost_price,
        status: this.status,
        created_at: this.created_at,
        updated_at: this.updated_at
      })
    } catch (error: any) {
      throw new Error(error.errors[0].message)
    }
  }
}
