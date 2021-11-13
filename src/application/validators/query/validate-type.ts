import { IValidator } from '@/domain/validators'
import { InvalidQueryError } from '@/application/errors'

export class ValidateType implements IValidator {
  async validate (input: Record<string, any>): Promise<InvalidQueryError | undefined> {
    const { type } = input

    if (type !== 'QA' && type !== 'TX' && type !== 'both') {
      return new InvalidQueryError('type')
    }
  }
}
