import { ValidatorProtocol } from '@/domain/validators'

import { InvalidQueryError } from '@/application/errors'

export class ValidateFields implements ValidatorProtocol {
  async validate (input: any): Promise<InvalidQueryError | undefined> {
    if (!input.fields) return

    if (typeof input.fields !== 'string') return new InvalidQueryError('fields')

    const fieldsArr = input.fields.split(',')

    if (fieldsArr.length > 10) return new InvalidQueryError('Only 10 fields are allowed')

    for (const field of fieldsArr) {
      if (field.startsWith('-')) {
        if (fieldsArr.includes(field.substr(1))) {
          return new InvalidQueryError(field)
        }
      }

      if (field.length > 24) return new InvalidQueryError(field)

      if (!field.match(/^[.a-zA-Z0-9_-]*$/)) return new InvalidQueryError(field)
    }
  }
}
