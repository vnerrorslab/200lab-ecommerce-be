import { Paging } from '~/shared/dto/paging'
import { Order, OrderSearchDTO, UpdateOrderDTO } from '../model/order'

import { Inventory } from '../model/inventory'
import { OrderResponseDTO } from '../infas/transport/dto/order-response'

export interface IOrderRepository {
  list_paginate(condition: OrderSearchDTO, paging: Paging): Promise<{ orders: OrderResponseDTO[]; total_pages: number }>

  findByOrderId(id: string): Promise<OrderResponseDTO | null>

  createOrder(dto: Order): Promise<string>

  update(id: string, dto: UpdateOrderDTO): Promise<boolean>
}

export interface IInventoryAdapter {
  list_all(productIds: string[]): Promise<Inventory[]>

  findByProductId(productId: string): Promise<Inventory>
}
