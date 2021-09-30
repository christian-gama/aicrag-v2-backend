import { ValidatorProtocol } from '@/domain/validators'
import { ValidatorErrorProtocol } from '@/domain/validators/validation-error-protocol'
export class ValidationComposite implements ValidatorProtocol {
  constructor (private readonly validations: ValidatorProtocol[]) {}

  async validate (input: any): Promise<ValidatorErrorProtocol | undefined> {
    for (const validation of this.validations) {
      const error = await validation.validate(input)

      if (error != null) return error
    }
  }
}
