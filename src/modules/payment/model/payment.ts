// orderId - amount - currency - userId - status - appTransId - paidAt - description - discountAmount
export class Payment {
  constructor(
    readonly orderId: string,
    readonly amount: number,
    readonly currency: string,
    readonly userId: string,
    readonly status: string,
    readonly appTransId: string,
    readonly paidAt?: Date,
    readonly description?: string,
    readonly discountAmount?: number
  ) {}
}

export class PaymentSearchDTO {
  constructor(
    readonly searchStr: string,
    readonly status: string
  ) {}
}

export interface IPaymentZaloType {
  app_id: string
  app_trans_id: string
  app_user: string
  app_time: number
  item: string | []
  embed_data: {}
  amount: number
  callback_url: string
  description: string
  bank_code: string
  discount_amount?: number
  mac?: string
}
