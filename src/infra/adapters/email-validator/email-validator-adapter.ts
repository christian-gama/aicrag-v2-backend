import { EmailValidator } from '@/application/protocols/validators/email-validator/email-validator-protocol'

export class EmailValidatorAdapter implements EmailValidator {
  isEmail (value: string): boolean {
    return true
  }
}
