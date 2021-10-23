import { IEmailValidator } from '@/domain/validators'

export const makeEmailValidatorStub = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isEmail (value: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}
