import { AccountValidatorProtocol } from '@/application/protocols/validators/account/account-validator-protocol'
import { AccountValidationComposite } from '@/application/usecases/validators/account'

interface SutTypes {
  sut: AccountValidatorProtocol
  validationStubs: AccountValidatorProtocol[]
}

export const makeSut = (): SutTypes => {
  const validationStubs = [makeValidationStub(), makeValidationStub()]
  const sut = new AccountValidationComposite(validationStubs)

  return { sut, validationStubs }
}

export const makeValidationStub = (): AccountValidatorProtocol => {
  class ValidationStub implements AccountValidatorProtocol {
    validate (input: any): Error | undefined {
      return undefined
    }
  }

  return new ValidationStub()
}
