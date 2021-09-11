import { EmailValidatorProtocol } from '@/application/protocols/validators/email-validator/email-validator-protocol'

import validator from 'validator'
export class EmailValidatorAdapter implements EmailValidatorProtocol {
  isEmail (value: string): boolean {
    return validator.isEmail(value)
  }
}
