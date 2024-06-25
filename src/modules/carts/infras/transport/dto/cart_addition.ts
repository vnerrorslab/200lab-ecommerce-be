import { z } from 'zod'
import { ErrProductIdEmpty, ErrQuantityEmpty, ErrUnitPriceEmpty, ErrUserIdEmpty } from '~/shared/error'

export class CreateCartDTO {
  constructor(
    readonly product_id: string,
    readonly quantity: string,
    readonly unit_price: string,
    readonly created_by: string
  ) {}

  validate(): void {
    const schema = z.object({
      product_id: z.string().min(1, { message: ErrProductIdEmpty.message }),

      quantity: z.string().min(1, { message: ErrQuantityEmpty.message }),

      unit_price: z.string().min(1, { message: ErrUnitPriceEmpty.message }),

      created_by: z.string().min(1, { message: ErrUserIdEmpty.message })
    })

    try {
      schema.parse({
        product_id: this.product_id,
        quantity: this.quantity,
        unit_price: this.unit_price,
        created_by: this.created_by
      })
    } catch (error: any) {
      throw new Error(error.errors[0].message)
    }
  }
}
