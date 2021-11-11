import { IValidator } from '@/domain/validators'
import { InvalidParamError, InvalidTypeError } from '@/application/errors'

export class ValidateUUID implements IValidator {
  validate (input: any): InvalidParamError | InvalidTypeError | undefined {
    const { id } = input

    if (!id) return new InvalidParamError('id')

    if (typeof id !== 'string') return new InvalidTypeError('id')

    // Verify if id matches a valid UUID xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx
    if (!id.match(/^[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-([0-9a-z]{11}|[0-9a-z]{12})$/)) {
      return new InvalidParamError('id')
    }
  }
}