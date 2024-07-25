import z from 'zod'

export class UpdateOrderDTO {
  constructor(
    readonly shippingAddress: string,
    readonly shippingPhonenumber: string,
    readonly shippingMethod: string,
    readonly paymentMethod: string,
    readonly paymentStatus: string,
    readonly trackingNumber: string,
    readonly orderStatus: string,
    readonly updatedAt: Date
  ) {}

  validate(): void {
    const schema = z
      .object({
        shippingAddress: z.string(),
        shippingPhonenumber: z.string(),
        shippingMethod: z.string(),
        paymentMethod: z.string(),
        paymentStatus: z.string(),
        updatedAt: z.date()
      })
      .required()

    try {
      schema.parse({
        shippingAddress: this.shippingAddress,
        shippingPhonenumber: this.shippingPhonenumber,
        shippingMethod: this.shippingMethod,
        paymentMethod: this.paymentMethod,
        paymentStatus: this.paymentStatus,
        updatedAt: this.updatedAt
      })
    } catch (error: any) {
      throw new Error(error.errors[0].message)
    }
  }
}
