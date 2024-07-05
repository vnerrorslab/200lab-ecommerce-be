import { BaseStatus } from '~/shared/dto/status'
import { Image } from './image'

export class Brand {
  constructor(
    readonly id: string,
    readonly name: string,
    public image: Image | null,
    readonly tagLine: string,
    readonly description: string,
    readonly status: BaseStatus,
    readonly createdBy: string,
    readonly updatedBy: string
  ) {}
}

export class BrandUpdateDTO {
  name?: string
  image?: string
  tagLine?: string
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
