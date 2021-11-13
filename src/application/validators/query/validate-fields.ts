import { IValidator } from '@/domain/validators'
import { InvalidParamError } from '@/application/errors'

export class ValidateFields implements IValidator {
  async validate (input: Record<string, any>): Promise<InvalidParamError | undefined> {
    const { fields } = input

    if (!fields) return

    if (typeof fields !== 'string') return new InvalidParamError('fields')

    const fieldsArr = fields.split(',')

    if (fieldsArr.length > 10) return new InvalidParamError('Only 10 fields are allowed')

    for (const field of fieldsArr) {
      if (field.startsWith('-')) {
        if (fieldsArr.includes(field.substr(1))) {
          return new InvalidParamError(field)
        }
      }

      if (field.length > 24) return new InvalidParamError(field)

      if (!field.match(/^[.a-zA-Z0-9_-]*$/)) return new InvalidParamError(field)
    }
  }
}
