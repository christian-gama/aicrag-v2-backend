import { ValidatorProtocol } from '@/domain/validators'

import { InvalidQueryError } from '@/application/errors'

export class ValidateYear implements ValidatorProtocol {
  async validate (input: any): Promise<InvalidQueryError | undefined> {
    if (typeof input.year !== 'string') return new InvalidQueryError('year')

    if (!input.year.match(/^[0-9]{4}$/)) return new InvalidQueryError('year')
  }
}