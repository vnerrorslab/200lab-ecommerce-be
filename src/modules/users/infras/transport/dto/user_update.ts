import { z } from 'zod'
import {
  ErrFirstNamePattern,
  ErrFirstNameEmpty,
  ErrLastNamePattern,
  ErrLastNameEmpty,
  ErrEmailInvalid,
  ErrEmailEmpty,
  ErrPasswordPattern,
  ErrPasswordMin,
  ErrPasswordEmpty,
  ErrPhoneEmpty,
  ErrPhoneLength,
  ErrPhonePattern,
  ErrPhoneStartWith,
  ErrAddressPattern,
  ErrIdentificationCardPattern,
  ErrIdentificationCardLength,
  ErrStatusPattern
} from '../../../../../shared/error'
import { UserStatus } from '../../../../../shared/dto/status'

export class UpdateUserDTO {
  constructor(
    readonly firstName: string,
    readonly lastName: string,
    readonly email: string,
    readonly password: string,
    readonly phone: string,
    readonly address: string,
    readonly identificationCard: string,
    readonly status: UserStatus
  ) {}

  validate(): void {
    const schema = z.object({
      firstName: z
        .string()
        .min(1, { message: ErrFirstNameEmpty.message })
        .regex(/^[A-Za-z]+$/, { message: ErrFirstNamePattern.message }),

      lastName: z
        .string()
        .min(1, { message: ErrLastNameEmpty.message })
        .regex(/^[A-Za-z]+$/, { message: ErrLastNamePattern.message }),

      email: z.string().min(1, { message: ErrEmailEmpty.message }).email({ message: ErrEmailInvalid.message }),

      password: z
        .string()
        .min(1, { message: ErrPasswordEmpty.message })
        .min(6, { message: ErrPasswordMin.message })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/, { message: ErrPasswordPattern.message }),

      phone: z
        .string()
        .min(1, { message: ErrPhoneEmpty.message })
        .startsWith('0', { message: ErrPhoneStartWith.message })
        .regex(/^[0-9]+$/, { message: ErrPhonePattern.message })
        .min(10, { message: ErrPhoneLength.message }),

      address: z
        .string()
        .optional() //không bắt buộc
        .refine((value) => value === undefined || /^[A-Za-z0-9\s]*$/.test(value), {
          message: ErrAddressPattern.message
        }),

      identificationCard: z
        .string()
        .optional() //không bắt buộc
        .refine((value) => value === undefined || /^[0-9\s]*$/.test(value), {
          message: ErrIdentificationCardPattern.message
        })
        .refine((value) => value === undefined || value.length === 12, {
          message: ErrIdentificationCardLength.message
        }),

      status: z.nativeEnum(UserStatus, { message: ErrStatusPattern.message }).optional()
    })

    try {
      schema.parse({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
        phone: this.phone,
        address: this.address,
        identificationCard: this.identificationCard,
        status: this.status
      })
    } catch (error: any) {
      throw new Error(error.errors[0].message)
    }
  }
}
