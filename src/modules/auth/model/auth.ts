export class User {
  constructor(
    readonly id: string,
    readonly firstName: string,
    readonly lastName: string,
    readonly email: string,
    readonly password: string,
    readonly salt: string,
    readonly status: string,
    readonly role: string,
    readonly actions: number
  ) {}
}