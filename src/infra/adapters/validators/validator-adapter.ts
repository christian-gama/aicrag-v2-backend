import { EmailValidatorProtocol } from '@/domain/validators'

import validator from 'validator'

export class ValidatorAdapter implements EmailValidatorProtocol {
  isEmail (value: string): boolean {
    return validator.isEmail(value)
  }
}
