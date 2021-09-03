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

  validateRequiredFields (input: Record<string, unknown>): Error | true {
    if (!input.email) return new MissingParamError('email')

    if (!input.name) return new MissingParamError('name')

    if (!input.password) return new MissingParamError('password')

    if (!input.passwordConfirmation) return new MissingParamError('passwordConfirmation')

    return true
  }
}
