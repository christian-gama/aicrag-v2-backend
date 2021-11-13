import { IValidator } from '@/domain/validators'

export const makeValidatorStub = (): IValidator => {
  class ValidatorStub implements IValidator {
    validate (input: Record<string, any>): Error | undefined {
      return undefined
    }
  }

  return new ValidatorStub()
}
