import { Image } from './image'

export class Brand {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly image: Image | null
  ) {}
}
