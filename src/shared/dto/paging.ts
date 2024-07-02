export class Paging {
  constructor(
    readonly page: number,
    readonly total: number,
    readonly limit: number,
    readonly cursor?: string,
    readonly nextCursor?: string
  ) {}
}

export class BasePaging<T> {
  constructor(
    readonly data: T[],
    readonly total_pages: number
  ) {}
}
