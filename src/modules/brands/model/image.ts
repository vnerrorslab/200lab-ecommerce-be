export class Image {
  url?: string

  constructor(
    readonly id: string,
    readonly path: string,
    readonly cloudName: string,
    readonly width: number,
    readonly height: number,
    readonly size: number
  ) {}

  fillUrl(domain: string) {
    this.url = `${domain}/${this.path}`
  }
}
