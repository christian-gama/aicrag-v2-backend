import { ValidationComposite, ValidatorProtocol } from '@/application/usecases/validators/account'

export const makeValidationStub = (): ValidatorProtocol => {
  class ValidationStub implements ValidatorProtocol {
    validate (input: any): Error | undefined {
      return undefined
    }
  }

  return new ValidationStub()
}

interface SutTypes {
  sut: ValidatorProtocol
  validationStubs: ValidatorProtocol[]
}

export const makeSut = (): SutTypes => {
  const validationStubs = [makeValidationStub(), makeValidationStub()]
  const sut = new ValidationComposite(validationStubs)

  return { sut, validationStubs }
}
