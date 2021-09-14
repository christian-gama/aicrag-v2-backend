import {
  ValidateEmail,
  ValidatorProtocol,
  EmailValidatorProtocol
} from '@/application/usecases/validators/account'
import { makeEmailValidatorStub } from '@/tests/__mocks__/infra/adapters/validators/mock-email-validator-adapter'

interface SutTypes {
  sut: ValidatorProtocol
  emailValidatorStub: EmailValidatorProtocol
}

export const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub()
  const sut = new ValidateEmail(emailValidatorStub)

  return { sut, emailValidatorStub }
}
