import { IValidator } from '@/domain/validators'
import { InvalidQueryError } from '@/application/errors'

export class ValidateDuration implements IValidator {
  async validate (input: any): Promise<InvalidQueryError | undefined> {
    if (input.operator && input.operator !== 'gte' && input.operator !== 'lte' && input.operator !== 'eq') {
      return new InvalidQueryError('operator')
    }

    if (input.duration && (input.duration <= 0 || input.duration > 30)) {
      return new InvalidQueryError('duration')
    }
  }
}
