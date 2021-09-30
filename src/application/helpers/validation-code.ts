import { ValidationCodeProtocol } from '@/domain/helpers'

import { randomAlphanumeric } from '.'

export class ValidationCode implements ValidationCodeProtocol {
  generate (): string {
    const code: Partial<string[]> = []

    for (let i = 0; i < 5; i++) {
      code.push(randomAlphanumeric())
    }

    return code.join('')
  }
}
