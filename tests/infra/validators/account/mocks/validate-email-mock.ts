import { ValidateEmail } from '@/infra/validators/account'
import { EmailValidator } from '@/application/validators/email-validator/email-validator-protocol'
import { AccountValidator } from '@/application/validators/account/account-validator-protocol'

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
