import { EmailValidatorProtocol } from '@/application/usecases/validators/user-validator'

export const makeEmailValidatorStub = (): EmailValidatorProtocol => {
  class EmailValidatorStub implements EmailValidatorProtocol {
    isEmail (value: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}
