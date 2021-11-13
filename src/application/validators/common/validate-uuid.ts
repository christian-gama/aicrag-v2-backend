import { IValidator } from '@/domain/validators'
import { InvalidParamError, InvalidTypeError } from '@/application/errors'

export class ValidateUUID implements IValidator {
  validate (input: Record<string, any>): InvalidParamError | InvalidTypeError | undefined {
    const { id } = input

    if (!id) return new InvalidParamError('id')

    if (typeof id !== 'string') return new InvalidTypeError('id', 'string', typeof id)

    if (!this.matchesUUIDFormat(id)) {
      return new InvalidParamError('id')
    }
  }

  private matchesUUIDFormat (id: string): boolean {
    // UUID format is xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx
    return !!id.match(/^[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-([0-9a-z]{11}|[0-9a-z]{12})$/)
  }
}
