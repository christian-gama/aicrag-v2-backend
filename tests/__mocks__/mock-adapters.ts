import { EmailValidatorProtocol } from '@/domain/validators'

export const makeEmailValidatorStub = (): EmailValidatorProtocol => {
  class EmailValidatorStub implements EmailValidatorProtocol {
    isEmail (value: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}
