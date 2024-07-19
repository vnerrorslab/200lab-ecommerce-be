import { Paging } from '~/shared/dto/paging'
import { PaymentCreateDTO } from '../infas/transport/dto/payment-create'
import { PaymentUpdateStatusDTO } from '../infas/transport/dto/payment-update'
import { Payment, PaymentSearchDTO } from '../model/payment'

export interface IPaymentUseCase {
  list_paginate(condition: PaymentSearchDTO, paging: Paging): Promise<{ payments: Payment[]; total_pages: number }>

  findById(id: string): Promise<Payment | null>

  createPayment(dto: PaymentCreateDTO): Promise<string>

  updatePayment(dto: PaymentUpdateStatusDTO): Promise<boolean>
}
