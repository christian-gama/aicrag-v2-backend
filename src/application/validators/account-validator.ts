import { MissingParamError, InvalidParamError } from '@/application/errors'

export class AccountValidator {
  validateEmail (email: string): Error | true {
    if (!email.includes('@')) return new InvalidParamError('email')

    return true
  }

  validateName (name: string): Error | true {
    if (name.match(/[^a-zA-Z ]/g)) return new InvalidParamError('name')

    return true
  }

  validatePassword (password: string): Error | true {
    if (password.length < 6 || password.length > 32) return new InvalidParamError('password')

    return true
  }

  validatePasswordEquality (password: string, passwordConfirmation: string): Error | true {
    if (password !== passwordConfirmation) return new InvalidParamError('passwordConfirmation')

    return true
  }

  validateRequiredFields (inputs: Record<string, unknown>, field: string): Error | true {
    if (!inputs[field]) return new MissingParamError(field)

    return true
  }
}
