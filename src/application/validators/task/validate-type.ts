import { IValidator } from '@/domain/validators'
import { InvalidParamError, InvalidTypeError } from '@/application/errors'

export class ValidateType implements IValidator {
  validate (input: Record<string, any>): InvalidTypeError | InvalidParamError | undefined {
    const { type } = input

    if (!type) return

    if (typeof type !== 'string') {
      return new InvalidTypeError('type', 'string', typeof type)
    }

    const types = ['TX', 'QA']
    if (!types.includes(type)) return new InvalidParamError('type')
  }
}
