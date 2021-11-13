import { IValidator } from '@/domain/validators'
import { InvalidParamError, InvalidTypeError } from '@/application/errors'

export class ValidateQuery implements IValidator {
  constructor (private readonly field: string) {}

  validate (input: Record<string, any>): InvalidTypeError | InvalidParamError | undefined {
    if (!input[this.field]) return

    if (typeof input[this.field] !== 'string') {
      return new InvalidTypeError(this.field, 'string', typeof input[this.field])
    }

    if (input[this.field].length > 120) return new InvalidParamError(this.field)
  }
}
