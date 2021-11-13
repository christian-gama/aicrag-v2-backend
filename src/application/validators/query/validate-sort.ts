import { IValidator } from '@/domain/validators'
import { InvalidQueryError } from '@/application/errors'

export class ValidateSort implements IValidator {
  async validate (input: Record<string, any>): Promise<InvalidQueryError | undefined> {
    if (!input.sort) return

    if (typeof input.sort !== 'string') return new InvalidQueryError('sort')

    const sortArr = input.sort.split(',')

    if (sortArr.length > 5) return new InvalidQueryError('Only 5 sort values are allowed')

    for (const sort of sortArr) {
      if (sort.startsWith('-')) {
        if (sortArr.includes(sort.substr(1))) {
          return new InvalidQueryError('sort')
        }
      }

      if (sort.length > 24) return new InvalidQueryError('sort')

      if (!sort.match(/^[.a-zA-Z0-9_-]*$/)) return new InvalidQueryError('sort')
    }
  }
}
