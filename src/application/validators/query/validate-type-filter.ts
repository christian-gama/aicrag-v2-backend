import { IValidator } from '@/domain/validators'
import { InvalidParamError } from '@/application/errors'

export class ValidateTypeFilter implements IValidator {
  async validate (input: Record<string, any>): Promise<InvalidParamError | undefined> {
    const { type } = input

    const types = ['TX', 'QA', 'both']
    if (!types.includes(type)) {
      return new InvalidParamError('type')
    }
  }
}
