import { z } from 'zod'
import { ErrorCategoryNameEmpty } from '~/shared/error'

export class CreateCategoryDTO {
  constructor(
    readonly name: string,
    readonly description: string,
    readonly parentId: string
  ) {}

  validate(): void {
    const schema = z.object({
      name: z.string().min(1, { message: ErrorCategoryNameEmpty.message }),

      parentId: z.string().optional(),

      description: z.string().optional()
    })

    try {
      schema.parse({
        name: this.name,
        parentId: this.parentId,
        description: this.description
      })
    } catch (error: any) {
      throw new Error(error.errors[0].message)
    }
  }
}
