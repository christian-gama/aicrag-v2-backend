import { IValidator } from '@/domain/validators'
import { InvalidParamError, InvalidTypeError } from '@/application/errors'

export class ValidateFields implements IValidator {
  async validate (input: Record<string, any>): Promise<InvalidTypeError | InvalidParamError | undefined> {
    const { fields } = input

    if (!fields) return

    if (typeof fields !== 'string') return new InvalidTypeError('fields', 'string', typeof fields)

    const fieldsArr = fields.split(',')

    if (fieldsArr.length > 10) return new InvalidParamError('fields')

    for (const field of fieldsArr) {
      if (this.hasRepeatedFields(fieldsArr, field)) {
        return new InvalidParamError(field)
      }

      if (field.length > 24) return new InvalidParamError(field)

      if (!field.match(/^[.a-zA-Z0-9_-]*$/)) return new InvalidParamError(field)
    }
  }

  private hasRepeatedFields (fieldsArr: string[], field: string): boolean {
    if (field.startsWith('-')) {
      return fieldsArr.includes(field.substr(1))
    }

    return false
  }
}
