import { IValidator } from '@/domain/validators'
import { InvalidParamError } from '@/application/errors'
import { InvalidTypeError } from '@/application/errors/invalid-type-error'

export class ValidateCommentary implements IValidator {
  validate (input: any): InvalidParamError | InvalidTypeError | undefined {
    const { commentary } = input

    if (!commentary) return

    if (typeof commentary !== 'string') return new InvalidTypeError('commentary', 'string', typeof commentary)

    if (commentary.length > 400) return new InvalidParamError('commentary')
  }
}
