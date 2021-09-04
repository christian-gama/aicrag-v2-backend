import { AccountValidationComposite } from '@/application/validators/account'
import { AccountValidator } from '@/domain/validators/account-validator-protocol'

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
