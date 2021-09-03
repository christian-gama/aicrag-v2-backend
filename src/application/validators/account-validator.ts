import { InvalidParamError } from '../errors/invalid-param-error'

export class AccountValidator {
  validateEmail (email: string): Error | undefined {
    if (!email.includes('@')) return new InvalidParamError('email')
  }
}
