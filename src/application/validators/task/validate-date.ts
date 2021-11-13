import { IValidator } from '@/domain/validators'
import { InvalidParamError } from '@/application/errors'

export class ValidateDate implements IValidator {
  validate (input: Record<string, any>): InvalidParamError | undefined {
    const { date } = input

    if (isNaN(Date.parse(date))) return new InvalidParamError('date')
  }
}
