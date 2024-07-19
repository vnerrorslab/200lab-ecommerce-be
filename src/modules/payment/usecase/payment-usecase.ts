import { v4 as uuidv4 } from 'uuid'
import { Paging } from '~/shared/dto/paging'
import { PaymentCreateDTO } from '../infas/transport/dto/payment-create'
import { PaymentUpdateStatusDTO } from '../infas/transport/dto/payment-update'
import { IPaymentRepository } from '../interfaces/repository'
import { IPaymentUseCase } from '../interfaces/usecase'
import { Payment, PaymentSearchDTO } from '../model/payment'

export class PaymentUseCase implements IPaymentUseCase {
  constructor(readonly paymentRepository: IPaymentRepository) {}

  list_paginate(condition: PaymentSearchDTO, paging: Paging): Promise<{ payments: Payment[]; total_pages: number }> {
    return this.paymentRepository.list_paginate(condition, paging)
  }
  async findById(id: string): Promise<Payment | null> {
    try {
      const payment = await this.paymentRepository.findById(id)
      if (!payment) {
        throw new Error('Payment not found!')
      }
      return payment
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  async createPayment(dto: PaymentCreateDTO): Promise<string> {
    try {
      dto.validate()

      const createPayment = new Payment(
        dto.orderId,
        dto.amount,
        dto.currency,
        dto.userId,
        dto.status,
        dto.appTransId,
        dto.paidAt,
        dto.description ?? '',
        dto.discountCode ?? 0
      )

      return this.paymentRepository.createPayment(createPayment)
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  async updatePayment(dto: PaymentUpdateStatusDTO): Promise<boolean> {
    try {
      dto.validate()

      const payment = await this.paymentRepository.findById(dto.id)

      if (!payment) {
        throw new Error('Payment not found!')
      }

      await this.paymentRepository.updatePaymentStatus(dto.id, dto.status)

      return true
    } catch (error: any) {
      throw new Error(error.message)
    }
  }
}
