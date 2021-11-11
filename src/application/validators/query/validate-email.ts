import { IEmailValidator, IValidator } from '@/domain/validators'
import { InvalidQueryError } from '@/application/errors'

export class ValidateEmail implements IValidator {
  constructor (private readonly emailValidator: IEmailValidator) {}

  validate (input: any): InvalidQueryError | undefined {
    const { email } = input

    if (typeof email !== 'string') return new InvalidQueryError('email')

    if (!this.emailValidator.isEmail(input.email)) return new InvalidQueryError('email')
  }
}
