import { v4 as uuidv4 } from 'uuid'

import { IOrderUseCase } from '../interfaces/usecase'
import { IInventoryAdapter, IOrderRepository } from '../interfaces/repository'

import { Order, OrderSearchDTO, OrderItem } from '../model/order'

import { UpdateOrderDTO } from '../infas/transport/dto/order-update'
import { CreateOrderDTO } from '../infas/transport/dto/order-create'
import { CreateOrderItemDTO } from '../infas/transport/dto/order-item-create'

import { BaseStatus } from '~/shared/dto/status'
import { Paging } from '~/shared/dto/paging'
import { OrderResponseDTO } from '../infas/transport/dto/order-response'

export class OrderUseCase implements IOrderUseCase {
  constructor(
    readonly orderRepository: IOrderRepository,
    readonly inventoryRepository: IInventoryAdapter
  ) {}

  async getAllOrder(
    condition: OrderSearchDTO,
    paging: Paging
  ): Promise<{ orders: OrderResponseDTO[]; total_pages: number }> {
    return await this.orderRepository.list_paginate(condition, paging)
  }

  async getOrderById(id: string): Promise<OrderResponseDTO | null> {
    const order = await this.orderRepository.findByOrderId(id)
    return order ?? null
  }

  async createOrder(dto: CreateOrderDTO, carts: CreateOrderItemDTO[]): Promise<string> {
    try {
      dto.validate()
      carts.map((cart) => cart.validate)
    } catch (error: any) {
      throw new Error(error.message)
    }

    const inventories = await this.inventoryRepository.list_all(carts.map((cart) => cart.productId))

    const inventoryMap = new Map()
    const invCheck: { productId: string; message: string }[] = []

    if (inventories) {
      for (const item of inventories) {
        inventoryMap.set(item.productId, { quantity: item.quantity, status: item.status })
      }
    }

    for (const item of carts) {
      const productInfo = inventoryMap.get(item.productId) || { quantity: 0, status: BaseStatus.OUTOFSTOCK }

      if (item.quantity > productInfo.quantity) {
        const quantityMissing = item.quantity - productInfo.quantity
        invCheck.push({
          productId: item.productId,
          message: `Product quantity is missing: ${quantityMissing}`
        })
      } else if (productInfo.status === BaseStatus.OUTOFSTOCK) {
        invCheck.push({ productId: item.productId, message: `Product is ${productInfo.status}` })
      }
    }

    if (invCheck.length > 0) {
      throw new Error(
        `Prouct(s) is not enough: ${invCheck.map((inv) => `id: ${inv.productId} - ${inv.message}`).join(', ')}`
      )
    }

    const orderId = uuidv4()

    const newOrderItem = carts.map(
      (cart) => new OrderItem(orderId, cart.productId, cart.productName, cart.unitPrice, cart.quantity)
    )

    const newOrder = new Order(
      orderId,
      dto.userId,
      newOrderItem,
      dto.orderStatus,
      '',
      '',
      '',
      '',
      'pending',
      new Date(),
      new Date()
    )

    await this.orderRepository.createOrder(newOrder)

    return orderId
  }

  async updateOrder(orderId: string, dto: UpdateOrderDTO): Promise<boolean> {
    try {
      dto.validate()
    } catch (error: any) {
      throw new Error(error.message)
    }

    const order = await this.orderRepository.findByOrderId(orderId)

    if (!order) {
      throw new Error('Order not found!')
    }

    const orderUpdate = {
      shippingAddress: dto.shippingAddress ?? order?.shippingAddress,
      shippingPhonenumber: dto.shippingPhonenumber ?? order?.shippingPhonenumber,
      shippingMethod: dto.shippingMethod ?? order?.shippingMethod,
      paymentMethod: dto.paymentMethod ?? order?.paymentMethod,
      paymentStatus: dto.paymentStatus ?? order?.paymentStatus,
      trackingNumber: dto.trackingNumber ?? order?.trackingNumber,
      orderStatus: dto.orderStatus ?? order?.orderStatus,
      updatedAt: dto.updatedAt ?? order?.updatedAt
    }

    await this.orderRepository.update(orderId, orderUpdate)

    return true
  }

  async cancelOrder(orderId: string, userId: string): Promise<boolean> {
    const order = await this.orderRepository.findByOrderId(orderId)

    if (!order) {
      throw new Error('Order not found!')
    }

    if (order.userId !== userId) {
      throw new Error('You are not authorized to cancel this order!')
    }

    const validStatuses = ['pending', 'confirmed']
    if (!validStatuses.includes(order.orderStatus)) {
      throw new Error('Order cannot be cancelled in its current status')
    }

    return true
  }
  processPayment(orderId: string): Promise<string> {
    throw new Error('Method not implemented.')
  }
  handlePaymentCallback(payment_data: any): Promise<string> {
    throw new Error('Method not implemented.')
  }
}
