import { ValidatorProtocol } from '@/domain/validators'

import { InvalidParamError } from '@/application/errors'

export class ValidateCommentary implements ValidatorProtocol {
  validate (input: any): InvalidParamError | undefined {
    if (input.commentary == null) return

    if (input.commentary.length > 400) return new InvalidParamError('commentary')
  }
}
