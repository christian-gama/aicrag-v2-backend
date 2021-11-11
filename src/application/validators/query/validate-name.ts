import { IValidator } from '@/domain/validators'
import { InvalidQueryError } from '@/application/errors'

export class ValidateName implements IValidator {
  validate (input: any): InvalidQueryError | undefined {
    if (!input.name) return

    if (typeof input.name !== 'string') {
      return new InvalidQueryError('name')
    }

    if (input.name.match(/[^a-zA-Z .']/g)) return new InvalidQueryError('name')
  }
}
