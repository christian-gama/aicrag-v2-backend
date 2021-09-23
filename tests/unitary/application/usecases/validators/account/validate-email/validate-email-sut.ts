import { ValidatorProtocol, EmailValidatorProtocol } from '@/application/protocols/validators'
import { ValidateEmail } from '@/application/usecases/validators'
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
