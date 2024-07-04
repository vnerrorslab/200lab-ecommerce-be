import { NextFunction, Router, type Request, type Response } from 'express'
import { IOrderUseCase } from '~/modules/order/interfaces/usecase'
import { OrderSearchDTO } from '~/modules/order/model/order'
import { Paging } from '~/shared/dto/paging'
import { CreateOrderDTO } from '../dto/order-create'
import { UpdateOrderDTO } from '../dto/order-update'
import { OrderStatus, PaymentStatus } from '~/shared/dto/status'

export class OrderService {
  constructor(readonly orderUseCase: IOrderUseCase) {}

  async getAllOrders(req: Request, res: Response) {
    const { searchStr } = req.query
    const { id } = req.params
    const userId = req.user?.userId as string

    const condition = new OrderSearchDTO(searchStr as string, id, userId)

    const limit = parseInt(req.query.limit as string) || 10
    const page = parseInt(req.query.page as string) || 1

    const paging: Paging = new Paging(page, 0, limit)

    const { orders, total_pages } = await this.orderUseCase.getAllOrder(condition, paging)

    const total = Math.ceil(total_pages / limit)

    return res.status(200).json({ code: 200, message: 'list orders', data: orders ?? [], total_pages: total })
  }

  async getOrderById(req: Request, res: Response) {
    const { id } = req.params

    const order = await this.orderUseCase.getOrderById(id)

    return res.status(200).json({ code: 200, message: 'Order data', data: order })
  }

  async createOrder(req: Request, res: Response) {
    try {
      const { cartItems } = req.body
      const userId = req.user?.userId as string

      const orderDTO = new CreateOrderDTO(userId, 'pending', new Date())

      const order = await this.orderUseCase.createOrder(orderDTO, cartItems)

      if (!order) {
        throw new Error('Failed to create order')
      }

      return res.status(201).json({ order })
    } catch (error: any) {
      res.status(400).json({ code: 400, message: error.message })
    }
  }

  async updateOrder(req: Request, res: Response) {
    try {
      const { id } = req.params

      const {
        shippingAddress,
        shippingPhonenumber,
        shippingMethod,
        paymentMethod,
        paymentStatus = PaymentStatus.PENDING,
        orderStatus = OrderStatus.PENDING,
        trackingNumber = null
      } = req.body

      const orderDTO = new UpdateOrderDTO(
        shippingAddress,
        shippingPhonenumber,
        shippingMethod,
        paymentMethod,
        paymentStatus,
        orderStatus,
        trackingNumber,
        new Date()
      )

      const isUpdate = await this.orderUseCase.updateOrder(id, orderDTO)

      return res.status(200).send({ code: 200, message: 'update order successful', data: isUpdate })
    } catch (error: any) {
      return res.status(400).send({ error: error.message })
    }
  }

  setupRoutes(auth: (req: Request, res: Response, next: NextFunction) => void): Router {
    const router = Router()

    router.get('/orders', auth, this.getAllOrders.bind(this))
    router.get('/orders/:id', this.getOrderById.bind(this))
    router.post('/orders', auth, this.createOrder.bind(this))
    router.put('/orders/:id', this.updateOrder.bind(this))

    return router
  }
}
