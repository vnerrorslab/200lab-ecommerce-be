import type { Paging } from '~/shared/dto/paging'
import type { CreateProductDTO } from '../infras/transport/dto/product_creation'
import type { ProductDetailDTO } from '../infras/transport/dto/product_detail'
import type { UpdateProductDTO } from '../infras/transport/dto/product_update'
import type { ProductListingConditionDTO } from '../model/product'

//nghiep vu
export interface IProductUseCase {
  createProduct(dto: CreateProductDTO): Promise<boolean>

  updateProduct(id: string, dto: UpdateProductDTO): Promise<boolean>

  deleteProduct(id: string): Promise<boolean>

  listingProduct(condition: ProductListingConditionDTO, paging: Paging): Promise<any>

  detailProduct(id: string): Promise<ProductDetailDTO | null>
}
