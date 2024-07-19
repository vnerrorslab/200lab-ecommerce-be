import { z } from 'zod'

export class PaymentCreateDTO {
  constructor(
    readonly orderId: string,
    readonly amount: number,
    readonly currency: string,
    readonly userId: string,
    readonly status: string,
    readonly appTransId: string,
    readonly paidAt: Date,
    readonly description: string,
    readonly discountCode: number
  ) {}

  validate(): void {
    const schema = z
      .object({
        orderId: z.string().uuid(),
        amount: z.number().positive(),
        currency: z.string().min(3).max(3),
        userId: z.string(),
        status: z.enum(['pending', 'success', 'failed']),
        appTransId: z.string(),
        paidAt: z.date()
      })
      .required()

    try {
      schema.parse(this)
    } catch (error: any) {
      throw new Error(error.errors[0].message)
    }
  }
}
