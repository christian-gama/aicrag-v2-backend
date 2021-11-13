import { IValidator } from '@/domain/validators'
import { InvalidQueryError } from '@/application/errors'

export class ValidateType implements IValidator {
  async validate (input: Record<string, any>): Promise<InvalidQueryError | undefined> {
    if (input.type !== 'QA' && input.type !== 'TX' && input.type !== 'both') {
      return new InvalidQueryError('type')
    }
  }
}
