import { v4 as uuidv4 } from 'uuid'

import { Cart, CartListingConditionDTO } from '../model/cart'
import type { ICartRepository, IProductRepository } from '../interfaces/repository'
import type { ICartUseCase } from '../interfaces/usecase'
import type { CreateCartDTO } from '../infras/transport/dto/cart_addition'
import type { UpdateCartDTO } from '../infras/transport/dto/cart_update'
import { BasePaging, Paging } from '~/shared/dto/paging'
import { ProductDetail } from '../model/product'
import { Image } from '../model/image'

export class CartUseCase implements ICartUseCase {
  constructor(
    readonly cartRepository: ICartRepository,
    readonly productRepository: IProductRepository
  ) {}

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

      const newCart = new Cart(cartId, dto.product_id, parseInt(dto.quantity), dto.created_by)

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

  async listCarts(condition: CartListingConditionDTO, paging: Paging): Promise<BasePaging<Cart[]>> {
    const listCarts = await this.cartRepository.list(condition, paging)

    const productIds = new Set(listCarts.data.map((product) => product.product_id))

    const productMap = new Map<string, ProductDetail>()

    if (productIds.size !== 0) {
      const products = await this.productRepository.findByIds(Array.from(productIds))
      products.forEach((product: ProductDetail) => {
        if (product.images) {
          product.images.forEach((item) => {
            const image = new Image(item.id, item.path, item.cloud_name, item.width, item.height, item.size)
            image.fillUrl(process.env.URL_PUBLIC || '')
            item.url = image.url
          })
        }
      })

      products.forEach((product) => productMap.set(product.id, product))
    }

    const listProductDetail = listCarts.data.map((cart) => {
      const product = productMap.get(cart.product_id)
      return {
        ...cart,
        product
      }
    })

    return { data: listProductDetail, total_pages: listCarts.total_pages }
  }
}
