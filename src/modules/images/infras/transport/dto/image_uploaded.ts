import { z } from 'zod'
import { ErrHeightEmpty, ErrPathEmpty, ErrSizeEmpty, ErrWidthEmpty } from '~/shared/error'

export class UploadImageDTO {
  constructor(
    readonly path: string,
    readonly width: number,
    readonly height: number,
    readonly size: number,
    readonly status: string
  ) {}

  validate(): void {
    const schema = z.object({
      path: z.string().min(1, { message: ErrPathEmpty.message }),

      width: z.number().min(1, { message: ErrWidthEmpty.message }),

      height: z.number().min(1, { message: ErrHeightEmpty.message }),

      size: z.number().min(1, { message: ErrSizeEmpty.message }),

      status: z.string().optional()
    })

    try {
      schema.parse({
        path: this.path,
        width: this.width,
        height: this.height,
        size: this.size
      })
    } catch (error: any) {
      throw new Error(error.errors[0].message)
    }
  }
}
