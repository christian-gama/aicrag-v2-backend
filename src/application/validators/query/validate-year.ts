import { IValidator } from '@/domain/validators'
import { InvalidParamError } from '@/application/errors'

export class ValidateYear implements IValidator {
  async validate (input: Record<string, any>): Promise<InvalidParamError | undefined> {
    const { year } = input

    if (typeof year !== 'string') return new InvalidParamError('year')

    // Match format xxxx being x a number
    if (!year.match(/^[0-9]{4}$/)) return new InvalidParamError('year')
  }
}
