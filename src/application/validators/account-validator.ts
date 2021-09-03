import { MissingParamError, InvalidParamError } from '@/application/errors'

export class AccountValidator {
  validateEmail (email: string): Error | undefined {
    if (!email.includes('@')) return new InvalidParamError('email')
  }

  validateName (name: string): Error | undefined {
    if (name.match(/[^a-zA-Z ]/g)) return new InvalidParamError('name')
  }

  validatePassword (password: string): Error | undefined {
    if (password.length < 6 || password.length > 32) return new InvalidParamError('password')
  }

  validatePasswordEquality (password: string, passwordConfirmation: string): Error | undefined {
    if (password !== passwordConfirmation) return new InvalidParamError('passwordConfirmation')
  }

  validateRequiredFields (input: Record<any, unknown>): Error | undefined {
    if (!input.email) return new MissingParamError('email')

    if (!input.name) return new MissingParamError('name')

    if (!input.password) return new MissingParamError('password')
  }
}
