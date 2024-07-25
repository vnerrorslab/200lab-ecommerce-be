import { z } from 'zod'
import { Image } from '~/modules/products/model/image'
import { BaseStatus } from '~/shared/dto/status'
import { ErrImageEmpty, ErrPriceEmpty, ErrProductNameEmpty, ErrStatusPattern } from '~/shared/error'

export class UpdateProductDTO {
  constructor(
    readonly name: string,
    readonly images: string[],
    readonly price: number,
    readonly quantity: number,
    readonly brandId: string,
    readonly categoryId: string,
    readonly description: string,
    readonly status: BaseStatus,
    readonly updatedBy: string
  ) {}

  validate(): void {
    const schema = z.object({
      name: z.string().min(1, { message: ErrProductNameEmpty.message }),

      price: z.string().min(1, { message: ErrPriceEmpty.message }),

      quantity: z.string().optional(),

      brandId: z.string().optional(),

      categoryId: z.string().optional(),

      description: z.string().optional(),

      updatedBy: z.string().optional(),

      status: z.nativeEnum(BaseStatus, { message: ErrStatusPattern.message }).optional()
    })

    try {
      schema.parse({
        name: this.name,
        images: this.images,
        price: this.price,
        quantity: this.quantity,
        brandId: this.brandId,
        categoryId: this.categoryId,
        description: this.description,
        status: this.status,
        updatedBy: this.updatedBy
      })
    } catch (error: any) {
      throw new Error(error.errors[0].message)
    }
  }
}
