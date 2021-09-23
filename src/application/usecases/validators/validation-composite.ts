import { ValidatorProtocol } from '@/application/protocols/validators'

export class ValidationComposite implements ValidatorProtocol {
  constructor (private readonly validations: ValidatorProtocol[]) {}

  async validate (input: any): Promise<Error | undefined> {
    for (const validation of this.validations) {
      const error = await validation.validate(input)

      if (error) return error
    }
  }
}
