import { ValidationCodeProtocol } from '@/application/protocols/helpers/validation-code/validation-code'
import { randomAlphanumeric } from '../random-alphanumeric/random-alphanumeric'

export class ValidationCode implements ValidationCodeProtocol {
  generate (): string {
    const code: Partial<string[]> = []

    for (let i = 0; i < 5; i++) {
      code.push(randomAlphanumeric())
    }

    return code.join('')
  }
}