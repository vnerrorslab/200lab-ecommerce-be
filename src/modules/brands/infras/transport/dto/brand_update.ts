import { z } from 'zod'
import { ErrStatusPattern, ErrorBrandNameEmpty } from '~/shared/error'
import { BaseStatus } from '~/shared/dto/status'

export class UpdateBrandDTO {
  constructor(
    readonly name: string,
    readonly image: string,
    readonly tagLine: string,
    readonly description: string,
    readonly status: BaseStatus,
    readonly updatedBy: string
  ) {}

  validate(): void {
    const schema = z.object({
      name: z.string().min(1, { message: ErrorBrandNameEmpty.message }),

      tagLine: z.string().optional(),

      description: z.string().optional(),

      status: z.nativeEnum(BaseStatus, { message: ErrStatusPattern.message }).optional()
    })

    try {
      schema.parse({
        name: this.name,
        image: this.image,
        tagLine: this.tagLine,
        description: this.description,
        status: this.status
      })
    } catch (error: any) {
      throw new Error(error.errors[0].message)
    }
  }
}
