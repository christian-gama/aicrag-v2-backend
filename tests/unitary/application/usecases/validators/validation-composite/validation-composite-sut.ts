import { ValidatorProtocol } from '@/application/protocols/validators'
import { ValidationComposite } from '@/application/usecases/validators'
import { makeValidatorStub } from '@/tests/__mocks__/application/validators/mock-validator'

interface SutTypes {
  sut: ValidatorProtocol
  validationStubs: ValidatorProtocol[]
}

export const makeSut = (): SutTypes => {
  const validationStubs = [makeValidatorStub(), makeValidatorStub()]
  const sut = new ValidationComposite(validationStubs)

  return { sut, validationStubs }
}
