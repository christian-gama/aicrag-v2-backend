import { Validation } from '@/application/validators/protocols/validation-protocol'
import { AccountValidationComposite } from '@/application/validators/account/account-validation-composite'

interface SutTypes {
  sut: Validation
  validationStubs: Validation[]
}

export const makeSut = (): SutTypes => {
  const validationStubs = [makeValidationStub(), makeValidationStub()]
  const sut = new AccountValidationComposite(validationStubs)

  return { sut, validationStubs }
}

export const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | undefined {
      return undefined
    }
  }

  return new ValidationStub()
}
