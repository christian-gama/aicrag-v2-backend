import { ValidateEmail } from '@/application/validators/account'
import { EmailValidator } from '@/application/validators/protocols/email-validator-protocol'
import { AccountValidator } from '@/domain/validators/account-validator-protocol'

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isEmail (value: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

interface SutTypes {
  sut: AccountValidator
  emailValidatorStub: EmailValidator
}

export const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub()
  const sut = new ValidateEmail(emailValidatorStub)

  return { sut, emailValidatorStub }
}
