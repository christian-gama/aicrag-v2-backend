import { EmailValidator } from '@/application/validators/email-validator/email-validator-protocol'

export const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isEmail (value: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}
