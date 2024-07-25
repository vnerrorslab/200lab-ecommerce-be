import { z } from 'zod'
import { ErrProductIdEmpty, ErrQuantityEmpty } from '~/shared/error'

export class CreateCartDTO {
  constructor(
    readonly productId: string,
    readonly quantity: string,
    readonly createdBy: string
  ) {}

  validate(): void {
    const schema = z.object({
      productId: z.string().min(1, { message: ErrProductIdEmpty.message }),

      quantity: z.string().min(1, { message: ErrQuantityEmpty.message })
    })

    try {
      schema.parse({
        productId: this.productId,
        quantity: this.quantity
      })
    } catch (error: any) {
      throw new Error(error.errors[0].message)
    }
  }
}
