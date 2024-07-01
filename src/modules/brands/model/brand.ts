import { BaseStatus } from '~/shared/dto/status'
import { Image } from './image'

export class Brand {
  constructor(
    readonly id: string,
    readonly name: string,
    public image: Image | null,
    readonly tag_line: string,
    readonly description: string,
    readonly status: BaseStatus
  ) {}
}

export class BrandUpdateDTO {
  name?: string
  image?: string
  tag_line?: string
  description?: string
  status?: BaseStatus
}

export class BrandListingConditionDTO {
  constructor(readonly searchStr: string) {}
}

export class BrandChangeStatusDTO {
  constructor(
    readonly id: string,
    readonly status: string
  ) {}
}
