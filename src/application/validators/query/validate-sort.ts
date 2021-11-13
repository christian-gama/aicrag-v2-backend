import { IValidator } from '@/domain/validators'
import { InvalidParamError, InvalidTypeError } from '@/application/errors'

export class ValidateSort implements IValidator {
  async validate (input: Record<string, any>): Promise<InvalidTypeError | InvalidParamError | undefined> {
    const { sort } = input

    if (!sort) return

    if (typeof sort !== 'string') return new InvalidTypeError('sort', 'string', typeof sort)

    const sortArr = sort.split(',')

    if (sortArr.length > 5) return new InvalidParamError('sort')

    for (const sort of sortArr) {
      if (this.hasRepeatedSort(sortArr, sort)) {
        return new InvalidParamError('sort')
      }

      if (sort.length > 24) return new InvalidParamError('sort')

      // Matches a-z, A-Z, 0-9, _, -
      if (!sort.match(/^[.a-zA-Z0-9_-]*$/)) return new InvalidParamError('sort')
    }
  }

  private hasRepeatedSort (sortArr: string[], sort: string): boolean {
    if (sort.startsWith('-')) {
      return sortArr.includes(sort.substr(1))
    }

    return false
  }
}
