import { ValidatorProtocol } from '@/application/protocols/validators'

export const makeValidatorStub = (): ValidatorProtocol => {
  class ValidatorStub implements ValidatorProtocol {
    validate (input: any): Error | undefined {
      return undefined
    }
  }

  return new ValidatorStub()
}
