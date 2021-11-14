import { IValidator } from '@/domain/validators'
import { InvalidParamError, InvalidTypeError } from '../../errors'

export class ValidateCurrency implements IValidator {
  validate (input: Record<string, any>): InvalidTypeError | InvalidParamError | undefined {
    const { currency } = input

    if (!currency) return

    if (typeof currency !== 'string') return new InvalidTypeError('currency', 'string', typeof currency)

    const currencies = ['BRL', 'USD']
    if (!currencies.includes(currency)) {
      return new InvalidParamError('currency')
    }
  }
}
