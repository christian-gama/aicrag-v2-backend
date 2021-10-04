import { ValidatorProtocol } from '@/domain/validators'

import { InvalidParamError } from '@/application/errors'
import { InvalidTypeError } from '@/application/errors/invalid-type-error'

export class ValidateCommentary implements ValidatorProtocol {
  validate (input: any): InvalidParamError | InvalidTypeError | undefined {
    if (input.commentary == null) return

    if (typeof input.commentary !== 'string') return new InvalidTypeError('commentary')

    if (input.commentary.length > 400) return new InvalidParamError('commentary')
  }
}
