import { AccountValidator } from '@/application/protocols/validators/account/account-validator-protocol'
import { AccountValidationComposite } from '@/application/usecases/validators/account'

interface SutTypes {
  sut: AccountValidator
  validationStubs: AccountValidator[]
}

export const makeSut = (): SutTypes => {
  const validationStubs = [makeValidationStub(), makeValidationStub()]
  const sut = new AccountValidationComposite(validationStubs)

  return { sut, validationStubs }
}

export const makeValidationStub = (): AccountValidator => {
  class ValidationStub implements AccountValidator {
    validate (input: any): Error | undefined {
      return undefined
    }
  }

  return new ValidationStub()
}
