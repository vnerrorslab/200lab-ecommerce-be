import { z } from 'zod'
import { ErrorBrandNameEmpty, ErrorLogoEmpty } from '~/shared/error'

export class CreateBrandDTO {
  constructor(
    readonly name: string,
    readonly logo: string,
    readonly tag_line: string,
    readonly description: string
  ) {}

  validate(): void {
    const schema = z.object({
      name: z.string().min(1, { message: ErrorBrandNameEmpty.message }),

      logo: z.string().min(1, { message: ErrorLogoEmpty.message }),

      tag_line: z.string().optional(),

      description: z.string().optional()
    })

    try {
      schema.parse({
        name: this.name,
        logo: this.logo,
        tag_line: this.tag_line,
        description: this.description
      })
    } catch (error: any) {
      throw new Error(error.errors[0].message)
    }
  }
}
