import z from 'zod'

export class PaymentUpdateStatusDTO {
  constructor(
    readonly id: string,
    readonly status: string
  ) {}

  validate(): void {
    const schema = z
      .object({
        id: z.string(),
        status: z.enum(['pending', 'success', 'failed'])
      })
      .required()

    try {
      schema.parse(this)
    } catch (error: any) {
      throw new Error(error.errors[0].message)
    }
  }
}
