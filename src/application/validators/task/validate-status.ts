import { IValidator } from '@/domain/validators'
import { InvalidParamError } from '@/application/errors'

export class ValidateStatus implements IValidator {
  validate (input: Record<string, any>): InvalidParamError | undefined {
    const { status } = input

    if (status !== 'in_progress' && status !== 'completed') {
      return new InvalidParamError('status')
    }
  }
}
