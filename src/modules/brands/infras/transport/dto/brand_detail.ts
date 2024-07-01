import { BaseStatus } from '~/shared/dto/status'

export class BrandDetailDTO {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly image: string,
    readonly tag_line: string,
    readonly description: string,
    readonly status: BaseStatus
  ) {}
}
