import EventEmitter from 'node:events'

export const sharedEventEmitter = new EventEmitter()

export const USING_IMAGE = 'used'

export interface UsingImageEvent {
  imageId: string
}
