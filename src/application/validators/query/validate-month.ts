import { IValidator } from '@/domain/validators'
import { InvalidParamError } from '@/application/errors'

export class ValidateMonth implements IValidator {
  async validate (input: Record<string, any>): Promise<InvalidParamError | undefined> {
    const { month } = input

    if (typeof month !== 'string') return new InvalidParamError('month')

    if (+month < 0 || +month > 11) return new InvalidParamError('month')
  }
}
