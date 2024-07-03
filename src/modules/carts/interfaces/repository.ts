import type { BasePaging, Paging } from '../../../shared/dto/paging'
import { Brand } from '../model/brand'
import type { Cart, CartListingConditionDTO, CartUpdateDTO } from '../model/cart'
import { Category } from '../model/category'
import { Image } from '../model/image'
import { ProductDetail } from '../model/product'

export interface ICartRepository {
  insert(data: Cart): Promise<string>

  findProductById(productId: string): Promise<Cart | null>

  findById(id: string): Promise<Cart | null>

  list(condition: CartListingConditionDTO, paging: Paging): Promise<BasePaging<Cart[]>>

  updateQuantityById(id: string, data: CartUpdateDTO): Promise<boolean>

  deleteItemById(id: string): Promise<boolean>
}

export interface IProductRepository {
  findById(id: string): Promise<ProductDetail | null>

  findByIds(ids: string[]): Promise<ProductDetail[]>
}

export interface IImageRepository {
  findById(id: string): Promise<Image | null>

  findByIds(ids: string[]): Promise<Image[]>
}

export interface IBrandRepository {
  findById(id: string): Promise<Brand | null>

  findByIds(ids: string[]): Promise<Brand[]>
}

export interface ICategoryRepository {
  findById(id: string): Promise<Category | null>

  findByIds(ids: string[]): Promise<Category[]>
}
