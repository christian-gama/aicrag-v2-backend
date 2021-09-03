import { Validation } from '../protocols/validation-protocol'

export class AccountValidationComposite implements Validation {
  constructor (private readonly validations: Validation[]) {}

  validate (input: any): Error | undefined {
    for (const validation of this.validations) {
      const error = validation.validate(input)

      if (error) return error
    }
  }
}
