import { IValidator } from '@/domain/validators'
import { InvalidParamError } from '@/application/errors'

export class ValidateDurationRange implements IValidator {
  async validate (input: Record<string, any>): Promise<InvalidParamError | undefined> {
    const { duration, operator } = input

    const operators = ['gte', 'lte', 'eq']
    if (operator && !operators.includes(operator)) {
      return new InvalidParamError('operator')
    }

    if (duration && (duration <= 0 || duration > 30)) {
      return new InvalidParamError('duration')
    }
  }
}
