import { ValidationCodeProtocol } from '@/application/protocols/helpers'

export const makeValidationCodeStub = (): ValidationCodeProtocol => {
  class ValidationCode implements ValidationCodeProtocol {
    generate (): string {
      return 'any_code'
    }
  }

  return new ValidationCode()
}
