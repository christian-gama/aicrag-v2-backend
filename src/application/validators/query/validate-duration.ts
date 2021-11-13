import { IValidator } from '@/domain/validators'
import { InvalidQueryError } from '@/application/errors'

export class ValidateDuration implements IValidator {
  async validate (input: Record<string, any>): Promise<InvalidQueryError | undefined> {
    const { duration, operator } = input

    const operators = ['gte', 'lte', 'eq']
    if (operator && !operators.includes(operator)) {
      return new InvalidQueryError('operator')
    }

    if (duration && (duration <= 0 || duration > 30)) {
      return new InvalidQueryError('duration')
    }
  }
}
