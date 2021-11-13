import { IValidator } from '@/domain/validators'
import { InvalidParamError } from '@/application/errors'

export class ValidateStatus implements IValidator {
  validate (input: Record<string, any>): InvalidParamError | undefined {
    const { status } = input

    const statuses = ['completed', 'in_progress']
    if (!statuses.includes(status)) {
      return new InvalidParamError('status')
    }
  }
}
