import { OrderItem } from '~/modules/order/model/order'

export class OrderResponseDTO {
  constructor(
    readonly id: string,
    readonly userId: string,
    readonly orderItem: OrderItem[],
    readonly totalAmount: number,
    readonly orderStatus: string,
    readonly shippingAddress: string,
    readonly shippingPhonenumber: string,
    readonly shippingMethod: string,
    readonly paymentMethod: string,
    readonly paymentStatus: string,
    readonly trackingNumber: string,
    readonly createdat: Date,
    readonly updatedAt: Date
  ) {}
}
