import { IValidator } from '@/domain/validators'
import { InvalidParamError, InvalidTypeError } from '../../errors'

export class ValidateName implements IValidator {
  validate (input: Record<string, any>): InvalidParamError | InvalidTypeError | undefined {
    const { name } = input

    if (!name) return

    if (typeof name !== 'string') return new InvalidTypeError('name', 'string', typeof name)

    // Allow a-z, A-Z, space and period
    if (name.match(/[^a-zA-Z .']/g)) return new InvalidParamError('name')
  }
}
