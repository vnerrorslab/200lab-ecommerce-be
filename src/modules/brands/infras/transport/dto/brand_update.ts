import { z } from 'zod'
import { ErrStatusPattern, ErrorBrandNameEmpty, ErrorLogoEmpty } from '~/shared/error'
import { BaseStatus } from '~/shared/dto/status'
import { Image } from '~/modules/brands/model/image'

export class UpdateBrandDTO {
  constructor(
    readonly name: string,
    readonly image: string,
    readonly tagLine: string,
    readonly description: string,
    readonly status: BaseStatus
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
