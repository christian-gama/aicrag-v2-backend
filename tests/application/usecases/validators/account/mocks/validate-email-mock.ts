import {
  ValidateEmail,
  ValidatorProtocol,
  EmailValidatorProtocol
} from '@/application/usecases/validators/account'

const makeEmailValidatorStub = (): EmailValidatorProtocol => {
  class EmailValidatorStub implements EmailValidatorProtocol {
    isEmail (value: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

interface SutTypes {
  sut: ValidatorProtocol
  emailValidatorStub: EmailValidatorProtocol
}

export const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub()
  const sut = new ValidateEmail(emailValidatorStub)

  return { sut, emailValidatorStub }
}
