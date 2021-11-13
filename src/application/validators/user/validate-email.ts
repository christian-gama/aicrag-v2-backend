import { IValidator, IEmailValidator } from '@/domain/validators'
import { InvalidParamError, InvalidTypeError } from '../../errors'

export class ValidateEmail implements IValidator {
  constructor (private readonly emailValidator: IEmailValidator) {}

  validate (input: Record<string, any>): InvalidParamError | InvalidTypeError | undefined {
    const { email } = input

    if (!email) return

    if (typeof email !== 'string') return new InvalidTypeError('email', 'string', typeof email)

    if (!this.emailValidator.isEmail(input.email)) return new InvalidParamError('email')
  }
}
