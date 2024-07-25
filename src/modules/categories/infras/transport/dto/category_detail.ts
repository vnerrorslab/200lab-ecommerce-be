import { BaseStatus } from '~/shared/dto/status'

export class CategoryDetailDTO {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly descripiton: string,
    readonly status: BaseStatus,
    readonly parentId: string
  ) {}
}
