import EventEmitter from 'node:events'

export const userEventEmitter = new EventEmitter()

export const USER_USING_IMAGE = 'used'

export interface UserUsingImageEvent {
  image_id: string
}
