import { Paging } from '~/shared/dto/paging'
import { IPaymentRepository } from '../../interfaces/repository'
import { Payment, PaymentSearchDTO } from '../../model/payment'
import { PaymentPersistence } from './dto/payment'
import { WhereOptions } from 'sequelize'

export class MysqlPaymentRepository implements IPaymentRepository {
  async list_paginate(
    condition: PaymentSearchDTO,
    paging: Paging
  ): Promise<{ payments: Payment[]; total_pages: number }> {
    try {
      let whereClause: WhereOptions = {}

      if (condition.searchStr) {
        whereClause = {
          ...whereClause,
          status: condition.status
        }
      }

      const { rows: payment, count: total_count } = await PaymentPersistence.findAndCountAll({
        where: whereClause,
        limit: paging.limit,
        offset: (paging.page - 1) * paging.limit
      })

      const total_pages = Math.ceil(total_count / paging.limit)

      return {
        payments: payment.map((pay) => pay.get({ plain: true })),
        total_pages
      }
    } catch (error: any) {
      throw new Error(`Error listing orders: ${error.message}`)
    }
  }

  async findById(id: string): Promise<Payment | null> {
    const payment = await PaymentPersistence.findOne({ where: { appTransId: id } })

    return payment?.get({ plain: true })
  }

  async createPayment(data: Payment): Promise<string> {
    try {
      const paymentCreate = {
        orderId: data.orderId,
        amount: data.amount,
        currency: data.currency,
        status: data.status,
        appTransId: data.appTransId,
        userId: data.userId,
        paidAt: data.paidAt,
        description: data.description,
        discountAmount: data.discountAmount || 0
      }

      const result = await PaymentPersistence.create(paymentCreate)

      return result.getDataValue('id')
    } catch (error: any) {
      console.log(error)

      throw new Error(`Error inserting payment: ${error.message}`)
    }
  }

  async updatePaymentStatus(id: string, status: string): Promise<boolean> {
    try {
      const [affectedCount] = await PaymentPersistence.update({ status }, { where: { appTransId: id } })
      return affectedCount > 0
    } catch (error: any) {
      throw new Error(error.message)
    }
  }
}
