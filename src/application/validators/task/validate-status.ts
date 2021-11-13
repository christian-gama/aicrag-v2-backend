import { IValidator } from '@/domain/validators'
import { InvalidParamError } from '@/application/errors'

export class ValidateStatus implements IValidator {
  validate (input: Record<string, any>): InvalidParamError | undefined {
    if (input.status !== 'in_progress' && input.status !== 'completed') {
      return new InvalidParamError('status')
    }
  }
}
