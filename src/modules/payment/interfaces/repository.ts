import { Paging } from '~/shared/dto/paging'
import { Payment, PaymentSearchDTO } from '../model/payment'

export interface IPaymentRepository {
  list_paginate(condition: PaymentSearchDTO, paging: Paging): Promise<{ payments: Payment[]; total_pages: number }>

  findById(id: string): Promise<Payment | null>

  createPayment(data: Payment): Promise<string>

  updatePaymentStatus(orderId: string, status: string): Promise<boolean>
}
