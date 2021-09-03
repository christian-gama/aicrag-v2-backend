import { InvalidParamError } from '@/application/errors/invalid-param-error'

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
}
