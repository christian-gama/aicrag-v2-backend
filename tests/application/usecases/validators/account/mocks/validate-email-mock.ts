import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { EmailValidator } from '@/application/protocols/validators/email-validator/email-validator-protocol'
import { ValidateEmail } from '@/application/usecases/validators/account'

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isEmail (value: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

interface SutTypes {
  sut: ValidatorProtocol
  emailValidatorStub: EmailValidator
}

export const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub()
  const sut = new ValidateEmail(emailValidatorStub)

  return { sut, emailValidatorStub }
}
