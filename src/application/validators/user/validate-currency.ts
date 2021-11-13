import { IValidator } from '@/domain/validators'
import { InvalidParamError } from '../../errors'

export class ValidateCurrency implements IValidator {
  validate (input: Record<string, any>): InvalidParamError | undefined {
    const { currency } = input

    const currencies = ['BRL', 'USD']
    if (!currencies.includes(currency)) {
      return new InvalidParamError('currency')
    }
  }
}
