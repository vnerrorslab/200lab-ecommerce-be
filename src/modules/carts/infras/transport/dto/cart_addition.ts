import { z } from 'zod'
import { ErrProductIdEmpty, ErrQuantityEmpty } from '~/shared/error'

export class CreateCartDTO {
  constructor(
    readonly product_id: string,
    readonly quantity: string,
    readonly created_by: string
  ) {}

  validate(): void {
    const schema = z.object({
      product_id: z.string().min(1, { message: ErrProductIdEmpty.message }),

      quantity: z.string().min(1, { message: ErrQuantityEmpty.message })
    })

    try {
      schema.parse({
        product_id: this.product_id,
        quantity: this.quantity
      })
    } catch (error: any) {
      throw new Error(error.errors[0].message)
    }
  }
}
