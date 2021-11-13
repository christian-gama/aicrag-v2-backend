import { IValidator } from '@/domain/validators'
import { InvalidParamError } from '@/application/errors'

export class ValidateType implements IValidator {
  validate (input: Record<string, any>): InvalidParamError | undefined {
    const { type } = input

    if (type !== 'QA' && type !== 'TX') return new InvalidParamError('type')
  }
}
