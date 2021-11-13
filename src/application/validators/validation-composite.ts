import { IValidator } from '@/domain/validators'
import { IValidatorError } from '@/domain/validators/validation-error.model'
export class ValidationComposite implements IValidator {
  constructor (private readonly validations: IValidator[]) {}

  async validate (input: Record<string, any>): Promise<IValidatorError | undefined> {
    for (const validation of this.validations) {
      const error = await validation.validate(input)

      if (error) return error
    }
  }
}
