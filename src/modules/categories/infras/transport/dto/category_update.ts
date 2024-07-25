import { z } from 'zod'
import { BaseStatus } from '~/shared/dto/status'
import { ErrStatusPattern, ErrorCategoryNameEmpty, ErrorParentEmpty } from '~/shared/error'

export class UpdateCategoryDTO {
  constructor(
    readonly name: string,
    readonly description: string,
    readonly parentId: string,
    readonly status: BaseStatus,
    readonly updatedBy: string
  ) {}

  validate(): void {
    const schema = z.object({
      name: z.string().min(1, { message: ErrorCategoryNameEmpty.message }),

      parentId: z.string().min(1, { message: ErrorParentEmpty.message }),

      description: z.string().optional(),

      status: z.nativeEnum(BaseStatus, { message: ErrStatusPattern.message }).optional()
    })

    try {
      schema.parse({
        name: this.name,
        parentId: this.parentId,
        description: this.description,
        status: this.status
      })
    } catch (error: any) {
      throw new Error(error.errors[0].message)
    }
  }
}
