import { IValidator } from '@/domain/validators'

import { InvalidParamError, InvalidTypeError } from '../../errors'

export class ValidateName implements IValidator {
  validate (input: any): InvalidParamError | InvalidTypeError | undefined {
    const { name } = input

    if (typeof name !== 'string') return new InvalidTypeError('name')

    if (name.match(/[^a-zA-Z .']/g)) return new InvalidParamError('name')
  }
}
