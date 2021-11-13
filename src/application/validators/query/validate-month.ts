import { IValidator } from '@/domain/validators'
import { InvalidParamError, InvalidTypeError } from '@/application/errors'

export class ValidateMonth implements IValidator {
  async validate (input: Record<string, any>): Promise<InvalidTypeError | InvalidParamError | undefined> {
    const { month } = input

    if (typeof month !== 'string') return new InvalidTypeError('month', 'string', typeof month)

    if (+month < 0 || +month > 11) return new InvalidParamError('month')
  }
}
