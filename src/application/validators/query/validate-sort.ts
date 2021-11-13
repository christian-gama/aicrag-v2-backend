import { IValidator } from '@/domain/validators'
import { InvalidParamError } from '@/application/errors'

export class ValidateSort implements IValidator {
  async validate (input: Record<string, any>): Promise<InvalidParamError | undefined> {
    const { sort } = input

    if (!sort) return

    if (typeof sort !== 'string') return new InvalidParamError('sort')

    const sortArr = sort.split(',')

    if (sortArr.length > 5) return new InvalidParamError('Only 5 sort values are allowed')

    for (const sort of sortArr) {
      if (sort.startsWith('-')) {
        if (sortArr.includes(sort.substr(1))) {
          return new InvalidParamError('sort')
        }
      }

      if (sort.length > 24) return new InvalidParamError('sort')

      if (!sort.match(/^[.a-zA-Z0-9_-]*$/)) return new InvalidParamError('sort')
    }
  }
}
