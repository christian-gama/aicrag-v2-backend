import { AccountValidator } from '@/domain/validators/account-validator-protocol'

export class AccountValidationComposite implements AccountValidator {
  constructor (private readonly validations: AccountValidator[]) {}

  validate (input: any): Error | undefined {
    for (const validation of this.validations) {
      const error = validation.validate(input)

      if (error) return error
    }
  }
}
