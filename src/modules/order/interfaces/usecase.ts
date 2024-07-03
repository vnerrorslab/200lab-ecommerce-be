import { Paging } from '~/shared/dto/paging'
import { UpdateOrderDTO } from '../infas/transport/dto/order-update'
import { CreateOrderDTO } from '../infas/transport/dto/order-create'
import { OrderSearchDTO } from '../model/order'
import { CreateOrderItemDTO } from '../infas/transport/dto/order-item-create'
import { OrderResponseDTO } from '../infas/transport/dto/order-response'

export interface IOrderUseCase {
  getAllOrder(condition: OrderSearchDTO, paging: Paging): Promise<{ orders: OrderResponseDTO[]; total_pages: number }>

  getOrderById(id: string): Promise<OrderResponseDTO | null>

  createOrder(dto: CreateOrderDTO, carts: CreateOrderItemDTO[]): Promise<string>

  updateOrder(orderId: string, dto: UpdateOrderDTO): Promise<boolean>

  cancelOrder(orderId: string, userId: string): Promise<boolean>

  processPayment(orderId: string): Promise<string>

  handlePaymentCallback(paymentData: any): Promise<string>
}
