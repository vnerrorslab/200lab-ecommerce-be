import type { Paging } from '~/shared/dto/paging'
import type { ProductDetailDTO } from '../infras/transport/dto/product_detail'
import type { Product, ProductListingConditionDTO, ProductUpdateDTO } from '../model/product'

// xu ly nghiep vu - duoi database
export interface IProductRepository {
  insertProduct(data: Product): Promise<string>

  findById(id: string): Promise<Product | null>

  findByName(name: string): Promise<Product | null>

  listingProduct(
    condition: ProductListingConditionDTO,
    paging: Paging
  ): Promise<{ products: Product[]; total_pages: number }>

  updateProductById(id: string, data: ProductUpdateDTO): Promise<boolean>

  deleteProductById(id: string): Promise<boolean>

  findProductById(id: string): Promise<ProductDetailDTO | null>
}
