import { EmailValidator } from '@/application/validators/protocols/email-validator-protocol'

export class EmailValidatorAdapter implements EmailValidator {
  isEmail (value: string): boolean {
    return true
  }
}
