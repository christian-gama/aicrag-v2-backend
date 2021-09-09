import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'

export class ValidationComposite implements ValidatorProtocol {
  constructor (private readonly validations: ValidatorProtocol[]) {}

  validate (input: any): Error | undefined {
    for (const validation of this.validations) {
      const error = validation.validate(input)

      if (error) return error
    }
  }
}
