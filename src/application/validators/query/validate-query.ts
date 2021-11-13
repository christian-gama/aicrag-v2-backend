import { IValidator } from '@/domain/validators'
import { InvalidQueryError } from '@/application/errors'

export class ValidateQuery implements IValidator {
  constructor (private readonly field: string) {}

  validate (input: Record<string, any>): InvalidQueryError | undefined {
    if (!input[this.field]) return

    if (typeof input[this.field] !== 'string') return new InvalidQueryError(this.field)

    if (input[this.field].length > 120) return new InvalidQueryError(this.field)
  }
}
