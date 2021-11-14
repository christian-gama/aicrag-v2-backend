import { IValidator } from '@/domain/validators'
import { InvalidParamError, InvalidTypeError } from '@/application/errors'

export class ValidateStatus implements IValidator {
  validate (input: Record<string, any>): InvalidTypeError | InvalidParamError | undefined {
    const { status } = input

    if (!status) return

    if (typeof status !== 'string') {
      return new InvalidTypeError('status', 'string', typeof status)
    }

    const statuses = ['completed', 'in_progress']
    if (!statuses.includes(status)) {
      return new InvalidParamError('status')
    }
  }
}
