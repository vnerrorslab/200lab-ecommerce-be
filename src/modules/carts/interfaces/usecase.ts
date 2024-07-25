import type { BasePaging, Paging } from '../../../shared/dto/paging'
import type { CreateCartDTO } from '../infras/transport/dto/cart_addition'
import type { UpdateCartDTO } from '../infras/transport/dto/cart_update'
import type { Cart, CartListingConditionDTO } from '../model/cart'

export interface ICartUseCase {
  createCart(dto: CreateCartDTO): Promise<boolean>

  updateCart(id: string, dto: UpdateCartDTO): Promise<boolean>

  deleteCart(id: string): Promise<boolean>

  listCarts(condition: CartListingConditionDTO, paging: Paging): Promise<BasePaging<Cart[]>>
}
