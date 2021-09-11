import { EmailValidatorProtocol } from '@/application/protocols/validators/email-validator/email-validator-protocol'

export const makeEmailValidatorStub = (): EmailValidatorProtocol => {
  class EmailValidatorStub implements EmailValidatorProtocol {
    isEmail (value: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}
