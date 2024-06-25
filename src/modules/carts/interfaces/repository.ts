import type { Paging } from '../../../shared/dto/paging'
import type { Cart, CartUpdateDTO, CartListingConditionDTO } from '../model/cart'

export interface ICartRepository {
  insert(data: Cart): Promise<string>

  findProductById(productId: string): Promise<Cart | null>

  findById(id: string): Promise<Cart | null>

  list(condition: CartListingConditionDTO, paging: Paging): Promise<{ carts: Cart[]; total_pages: number }>

  updateQuantityById(id: string, data: CartUpdateDTO): Promise<boolean>

  deleteItemById(id: string): Promise<boolean>
}
