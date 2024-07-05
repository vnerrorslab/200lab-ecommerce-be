import { Op, Transaction, type Sequelize, type WhereOptions } from 'sequelize'
import { OrderPersistence } from './dto/order'
import type { IOrderRepository } from '../../interfaces/repository'
import { OrderCreateDTO, Order, OrderItem, OrderSearchDTO, UpdateOrderDTO } from '../../model/order'
import { Paging } from '~/shared/dto/paging'
import { OrderItemPersistence } from './dto/order-item'
import { OrderResponseDTO } from '../transport/dto/order-response'

export class MysqlOrderRepository implements IOrderRepository {
  async list_paginate(
    condition: OrderSearchDTO,
    paging: Paging
  ): Promise<{ orders: OrderResponseDTO[]; total_pages: number }> {
    try {
      let whereClause: WhereOptions = {}

      if (condition.userId) {
        whereClause = {
          ...whereClause,
          userId: condition.userId,
          orderStatus: condition.status
        }
      }

      const { rows: orders, count: total_count } = await OrderPersistence.findAndCountAll({
        where: whereClause,
        limit: paging.limit,
        offset: (paging.page - 1) * paging.limit
      })

      const orderIds = orders.map((order) => order.getDataValue('id'))

      const orderItems = await OrderItemPersistence.findAll({
        where: { orderId: orderIds }
      })

      const ordersWithItems = orders.map((order) => {
        const orderData = order.get({ plain: true })
        orderData.orderItems = orderItems.filter((item) => item.getDataValue('orderId') === orderData.id)
        return orderData
      })

      const total_pages = Math.ceil(total_count / paging.limit)

      return {
        orders: ordersWithItems,
        total_pages
      }
    } catch (error: any) {
      throw new Error(`Error listing orders: ${error.message}`)
    }
  }

  async findByOrderId(id: string): Promise<OrderResponseDTO | null> {
    try {
      const orderData = await OrderPersistence.findByPk(id)

      if (!orderData) {
        return null
      }

      const orderItems = await OrderItemPersistence.findAll({ where: { orderId: id } })

      const order = orderData.get({ plain: true })

      order.orderItems = orderItems?.filter((item) => item.getDataValue('order_id') === order.id)

      return order ?? null
    } catch (error: any) {
      throw new Error(`Error find by order ID: ${error.message}`)
    }
  }

  async createOrder(data: Order): Promise<string> {
    try {
      const orderCreate = {
        id: data.id,
        userId: data.userId,
        orderStatus: data.orderStatus,
        shippingAddress: data.shippingAddress,
        shippingPhonenumber: data.shippingPhonenumber,
        shippingMethod: data.shippingMethod,
        paymentMethod: data.paymentMethod,
        paymentStatus: data.paymentStatus,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      }
      const result = await OrderPersistence.create(orderCreate)

      const orderItemsData = data.orderItems?.map((item) => ({
        orderId: result.getDataValue('id'),
        productId: item.productId,
        productName: item.productName,
        unitPrice: item.unitPrice,
        quantity: item.quantity
      }))
      console.log(0)

      console.log(data)

      if (orderItemsData && orderItemsData.length > 0) {
        await OrderItemPersistence.bulkCreate(orderItemsData)
      }

      return result.getDataValue('id')
    } catch (error: any) {
      throw new Error(`Error inserting order: ${error.message}`)
    }
  }

  async update(id: string, dto: UpdateOrderDTO): Promise<boolean> {
    try {
      console.log(dto)

      const updateOrder = {
        shippingAddress: dto.shippingAddress,
        shippingPhonenumber: dto.shippingPhonenumber,
        shippingMethod: dto.shippingMethod,
        paymentMethod: dto.paymentMethod,
        paymentStatus: dto.paymentStatus,
        orderStatus: dto.orderStatus,
        trackingNumber: dto.trackingNumber,
        updatedAt: dto.updatedAt
      }

      const result = await OrderPersistence.update(updateOrder, { where: { id } })

      return result[0] > 0
    } catch (error: any) {
      throw new Error(`Error updating order: ${error.message}`)
    }
  }
}
