import { AccountValidatorProtocol } from '@/application/protocols/validators/account/account-validator-protocol'

export class AccountValidationComposite implements AccountValidatorProtocol {
  constructor (private readonly validations: AccountValidatorProtocol[]) {}

  validate (input: any): Error | undefined {
    for (const validation of this.validations) {
      const error = validation.validate(input)

      if (error) return error
    }
  }
}
