export class OrderItem {
  constructor(
    readonly orderId: string,
    readonly productId: string,
    readonly productName: string,
    readonly unitPrice: number,
    readonly quantity: number
  ) {}
}

export class Order {
  trackingNumber?: string

  constructor(
    readonly id: string,
    readonly userId: string,
    readonly orderItems: OrderItem[],
    readonly orderStatus: string,
    readonly shippingAddress: string,
    readonly shippingPhonenumber: string,
    readonly shippingMethod: string,
    readonly paymentMethod: string,
    readonly paymentStatus: string,
    readonly createdAt: Date,
    readonly updatedAt: Date
  ) {}
}

export class OrderSearchDTO {
  constructor(
    readonly searchStr: string,
    readonly id: string,
    readonly userId: string
  ) {}
}

export class OrderCreateDTO {
  shippingAddress?: string
  shippingPhonenumber?: string
  shippingMethod?: string
  paymentMethod?: string
  paymentStatus?: string
  constructor(
    readonly id: string,
    readonly userId: string,
    readonly orderStatus: string,
    readonly createdAt: Date,
    readonly updatedAt: Date
  ) {}
}

export class UpdateOrderDTO {
  trackingNumber?: string
  constructor(
    readonly shippingAddress: string,
    readonly shippingPhonenumber: string,
    readonly shippingMethod: string,
    readonly paymentMethod: string,
    readonly paymentStatus: string,
    readonly orderStatus: string,
    readonly updatedAt: Date
  ) {}
}
