import { z } from 'zod'

export class CreateOrderDTO {
  constructor(
    readonly userId: string,
    readonly orderStatus: string,
    readonly createdAt: Date
  ) {}

  validate(): void {
    const schema = z
      .object({
        userId: z.string().uuid(),
        orderstatus: z.string(),
        createdAt: z.date()
      })
      .required()

    try {
      schema.parse({
        userId: this.userId,
        orderstatus: this.orderStatus,
        createdAt: this.createdAt
      })
    } catch (error: any) {
      throw new Error(error.errors[0].message)
    }
  }
}
