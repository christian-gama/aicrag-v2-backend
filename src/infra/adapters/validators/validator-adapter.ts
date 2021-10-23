import { IEmailValidator } from '@/domain/validators'

import validator from 'validator'

export class ValidatorAdapter implements IEmailValidator {
  isEmail (value: string): boolean {
    return validator.isEmail(value)
  }
}
