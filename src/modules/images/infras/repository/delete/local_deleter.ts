export class LocalDeleter {
  async deleteImageById(filename: string) {
    return true
  }
  cloudName() {
    return 'local'
  }
}
