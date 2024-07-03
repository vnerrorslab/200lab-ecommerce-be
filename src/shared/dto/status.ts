export enum BaseStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  AVAILABLE = 'available',
  OUTOFSTOCK = 'out_of_stock'
}

export enum UserStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  INACTIVE = 'inactive'
}

export enum ImageStatus {
  UPLOADED = 'uploaded',
  USED = 'used'
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPING = 'shipping',
  DELIVERED = 'delivered',
  COMPLETED = 'compeleted',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed'
}
