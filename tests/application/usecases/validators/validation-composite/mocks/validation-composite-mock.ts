import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { ValidationComposite } from '@/application/usecases/validators/account'

interface SutTypes {
  sut: ValidatorProtocol
  validationStubs: ValidatorProtocol[]
}

export const makeSut = (): SutTypes => {
  const validationStubs = [makeValidationStub(), makeValidationStub()]
  const sut = new ValidationComposite(validationStubs)

  return { sut, validationStubs }
}

export const makeValidationStub = (): ValidatorProtocol => {
  class ValidationStub implements ValidatorProtocol {
    validate (input: any): Error | undefined {
      return undefined
    }
  }

  return new ValidationStub()
}
