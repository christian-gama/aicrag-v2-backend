import { IValidator } from '@/domain/validators'
import { InvalidQueryError } from '@/application/errors'

export class ValidateType implements IValidator {
  async validate (input: Record<string, any>): Promise<InvalidQueryError | undefined> {
    const { type } = input

    const types = ['TX', 'QA', 'both']
    if (!types.includes(type)) {
      return new InvalidQueryError('type')
    }
  }
}
