import { EmailValidator } from '@/application/validators/email-validator/email-validator-protocol'

export class EmailValidatorAdapter implements EmailValidator {
  isEmail (value: string): boolean {
    return true
  }
}
