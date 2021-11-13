import { IValidator } from '@/domain/validators'
import { InvalidParamError } from '@/application/errors'

export class ValidateType implements IValidator {
  validate (input: Record<string, any>): InvalidParamError | undefined {
    const { type } = input

    if (!type) return

    const types = ['TX', 'QA']
    if (!types.includes(type)) return new InvalidParamError('type')
  }
}
