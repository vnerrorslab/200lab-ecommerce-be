import EventEmitter from 'node:events'

export const userEventEmitter = new EventEmitter()
export const productEventEmitter = new EventEmitter()

export const USER_USING_IMAGE = 'used'
export const PRODUCT_USING_IMAGE = 'used'

export interface UserUsingImageEvent {
  image_id: string
}

export interface ProductUsingImageEvent {
  image_id: string
}
