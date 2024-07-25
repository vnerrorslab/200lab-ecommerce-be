import { z } from 'zod'
import { ErrQuantityEmpty } from '~/shared/error'

export class UpdateCartDTO {
  constructor(readonly quantity: string) {}

  validate(): void {
    const schema = z.object({
      quantity: z.string().min(1, { message: ErrQuantityEmpty.message })
    })

    try {
      schema.parse({
        quantity: this.quantity
      })
    } catch (error: any) {
      throw new Error(error.errors[0].message)
    }
  }
}
