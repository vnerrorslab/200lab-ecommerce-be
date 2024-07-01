import { z } from 'zod'
import { ErrorBrandNameEmpty } from '~/shared/error'

export class CreateBrandDTO {
  constructor(
    readonly name: string,
    readonly image: string,
    readonly tag_line: string,
    readonly description: string
  ) {}

  validate(): void {
    const schema = z.object({
      name: z.string().min(1, { message: ErrorBrandNameEmpty.message }),

      tag_line: z.string().optional(),

      description: z.string().optional()
    })

    try {
      schema.parse({
        name: this.name,
        image: this.image,
        tag_line: this.tag_line,
        description: this.description
      })
    } catch (error: any) {
      throw new Error(error.errors[0].message)
    }
  }
}
