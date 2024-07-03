import { v4 as uuidv4 } from 'uuid'

import { Cart, CartListingConditionDTO } from '../model/cart'
import type { ICartRepository } from '../interfaces/repository'
import type { ICartUseCase } from '../interfaces/usecase'
import type { CreateCartDTO } from '../infras/transport/dto/cart_addition'
import type { UpdateCartDTO } from '../infras/transport/dto/cart_update'
import { BasePaging, Paging } from '~/shared/dto/paging'

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
    const carts = await this.cartRepository.list(condition, paging)
    console.log('cart', carts)
    const productIds = new Set(carts.data.map((product) => product))
    // const categoryId = new Set(carts.products.map((product) => product.category_id))

    // const categoryMap = new Map<string, Category>()
    // if (categoryId.size !== 0) {
    //   const categories = await this.categoryRepository.findByIds(Array.from(categoryId))
    //   categories.forEach((category) => categoryMap.set(category.id, category))
    // }

    // const brandMap = new Map<string, Brand>()
    // if (brandId.size !== 0) {
    //   const brands = await this.brandRepository.findByIds(Array.from(brandId))
    //   brands.forEach((brand: Brand) => {
    //     if (brand.image) {
    //       const image = new Image(
    //         brand.image.id,
    //         brand.image.path,
    //         brand.image.cloud_name,
    //         brand.image.width,
    //         brand.image.height,
    //         brand.image.size
    //       )
    //       image.fillUrl(process.env.URL_PUBLIC || '')
    //       brand.image.url = image.url
    //     }
    //   })

    //   brands.forEach((brand) => brandMap.set(brand.id, brand))
    // }

    // const listProductDetail = listProducts.products.map((product) => {
    //   return new ProductDetail(
    //     product.id,
    //     product.name,
    //     product.images,
    //     product.price,
    //     product.quantity,
    //     brandMap.get(product.brand_id) ?? null,
    //     categoryMap.get(product.category_id) ?? null,
    //     product.description,
    //     product.status,
    //     product.created_by,
    //     product.updated_by
    //   )
    // })

    return { data: [], total_pages: 0 }
  }
}
