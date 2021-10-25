import { IValidationCode } from '@/domain/helpers'

import { randomAlphanumeric } from '.'

export class ValidationCode implements IValidationCode {
  generate (): string {
    const code: Partial<string[]> = []

    for (let i = 0; i < 5; i++) {
      code.push(randomAlphanumeric())
    }

    const result = code.join('')

    return result
  }
}
