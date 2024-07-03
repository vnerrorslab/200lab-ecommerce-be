import { Router, type Request, type Response } from 'express'
import { CreateCartDTO } from '../dto/cart_addition'
import { UpdateCartDTO } from '../dto/cart_update'
import { ICartUseCase } from '~/modules/carts/interfaces/usecase'
import { CartListingConditionDTO } from '~/modules/carts/model/cart'
import { Paging } from '~/shared/dto/paging'

export class CartService {
  constructor(readonly cartUseCase: ICartUseCase) {}

  async insert_cart(req: Request, res: Response) {
    try {
      const { product_id, quantity, created_by } = req.body
      const cartDTO = new CreateCartDTO(product_id, quantity, created_by)

      const cart = await this.cartUseCase.createCart(cartDTO)

      res.status(201).send({ code: 201, message: 'add cart successfull', data: cart })
    } catch (error: any) {
      res.status(400).send({ error: error.message })
    }
  }

  async list_carts(req: Request, res: Response) {
    try {
      const { searchStr } = req.query
      const { id } = req.params
      const condition = new CartListingConditionDTO(searchStr as string, id)

      //phân trang á nè nha
      const limit = parseInt(req.query.limit as string) || 10
      const page = parseInt(req.query.page as string) || 1

      const paging: Paging = new Paging(page, 0, limit)

      const { data, total_pages } = await this.cartUseCase.listCarts(condition, paging)

      const total = Math.ceil(total_pages / limit)

      return res.status(200).json({ code: 200, message: 'list carts', data, total_pages: total })
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  }

  async update_cart(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { quantity } = req.body

      const cartDTO = new UpdateCartDTO(quantity)

      const cart = await this.cartUseCase.updateCart(id, cartDTO)

      return res.status(200).send({ code: 200, message: 'update cart successful', data: cart })
    } catch (error: any) {
      return res.status(400).send({ error: error.message })
    }
  }

  async delete_cart(req: Request, res: Response) {
    try {
      const { id } = req.params

      await this.cartUseCase.deleteCart(id)

      return res.status(200).send({ code: 200, message: 'delete cart successful' })
    } catch (error: any) {
      return res.status(400).send({ error: error.message })
    }
  }

  setupRoutes(): Router {
    const router = Router()

    router.get('/carts/:id', this.list_carts.bind(this))

    router.post('/carts', this.insert_cart.bind(this))

    router.put('/carts/:id', this.update_cart.bind(this))

    router.delete('/carts/:id', this.delete_cart.bind(this))

    return router
  }
}
