import { z } from 'zod'
import { BaseStatus } from '~/shared/dto/status'
import { ErrImageEmpty, ErrPriceEmpty, ErrProductNameEmpty, ErrStatusPattern } from '~/shared/error'

export class UpdateProductDTO {
  constructor(
    readonly name: string,
    readonly images: string[],
    readonly price: number,
    readonly quantity: number,
    readonly brand_id: string,
    readonly category_id: string,
    readonly description: string,
    readonly status: BaseStatus,
    readonly created_by: string,
    readonly updated_by: string
  ) {}

  validate(): void {
    const schema = z.object({
      name: z.string().min(1, { message: ErrProductNameEmpty.message }),

      price: z.string().min(1, { message: ErrPriceEmpty.message }),

      quantity: z.string().optional(),

      brand_id: z.string().optional(),

      category_id: z.string().optional(),

      description: z.string().optional(),

      created_by: z.string().optional(),

      updated_by: z.string().optional(),

      status: z.nativeEnum(BaseStatus, { message: ErrStatusPattern.message }).optional()
    })

    try {
      schema.parse({
        name: this.name,
        images: this.images,
        price: this.price,
        quantity: this.quantity,
        brand_id: this.brand_id,
        category_id: this.category_id,
        description: this.description,
        status: this.status,
        created_by: this.created_by,
        updated_by: this.updated_by
      })
    } catch (error: any) {
      throw new Error(error.errors[0].message)
    }
  }
}
