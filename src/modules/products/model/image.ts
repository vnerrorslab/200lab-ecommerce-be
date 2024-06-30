export class Image {
  url?: string

  constructor(
    readonly id: string,
    readonly path: string,
    readonly cloud_name: string,
    readonly width: number,
    readonly height: number
  ) {}

  fillUrl(domain: string) {
    this.url = `${domain}/${this.path}`
  }
}
