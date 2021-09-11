import { ValidationCodeProtocol } from '@/application/usecases/helpers/validation-code/'
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
