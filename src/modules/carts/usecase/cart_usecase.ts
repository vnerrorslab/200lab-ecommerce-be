import { v4 as uuidv4 } from 'uuid'

import { Cart, CartListingConditionDTO } from '../model/cart'
import type { ICartRepository } from '../interfaces/repository'
import type { ICartUseCase } from '../interfaces/usecase'
import type { CreateCartDTO } from '../infras/transport/dto/cart_addition'
import type { UpdateCartDTO } from '../infras/transport/dto/cart_update'
import { Paging } from '~/shared/dto/paging'

export class CartUseCase implements ICartUseCase {
  constructor(readonly cartRepository: ICartRepository) {}

  async createCart(dto: CreateCartDTO): Promise<boolean> {
    try {
      dto.validate()
    } catch (error: any) {
      throw new Error(error.message)
    }

    const cart = await this.cartRepository.findProductById(dto.product_id)

    if (cart) {
      const updatedQuantity = cart.quantity + parseInt(dto.quantity)
      await this.cartRepository.updateQuantityById(cart.id, { quantity: updatedQuantity })
    } else {
      const cartId = uuidv4()

      const newCart = new Cart(cartId, dto.product_id, parseInt(dto.quantity), parseInt(dto.unit_price), dto.created_by)

      await this.cartRepository.insert(newCart)
    }

    return true
  }

  async updateCart(id: string, dto: UpdateCartDTO): Promise<boolean> {
    try {
      dto.validate()
    } catch (error: any) {
      throw new Error(error.message)
    }

    // Check cart
    const cart = await this.cartRepository.findById(id)
    if (!cart) {
      throw new Error('Cart item not found')
    }

    const updatedData = {
      quantity: parseInt(dto.quantity)
    }

    const success = await this.cartRepository.updateQuantityById(id, updatedData)

    if (!success) {
      throw new Error('Failed to update cart')
    }

    return true
  }

  async deleteCart(id: string): Promise<boolean> {
    try {
      const success = await this.cartRepository.deleteItemById(id)
      if (!success) {
        throw new Error('Failed to delete cart')
      }
      return true
    } catch (error: any) {
      throw new Error(`Error deleting cart: ${error.message}`)
    }
  }

  async listCarts(condition: CartListingConditionDTO, paging: Paging): Promise<{ carts: Cart[]; total_pages: number }> {
    return await this.cartRepository.list(condition, paging)
  }
}
