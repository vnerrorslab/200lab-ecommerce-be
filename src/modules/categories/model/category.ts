import type { BaseStatus } from '~/shared/dto/status'

export class Category {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly description: string,
    readonly status: BaseStatus,
    readonly parent_id: string
  ) {}
}

export class CategoryUpdateDTO {
  name?: string
  description?: string
  status?: BaseStatus
  parent_id?: string
}

export class CategoryListingConditionDTO {
  constructor(readonly searchStr: string) {}
}

export class CategoryChangeStatusDTO {
  constructor(
    readonly id: string,
    readonly status: string
  ) {}
}
