import { ValidatorProtocol } from '@/application/protocols/validators'
import { InvalidParamError } from '../errors'

export class ValidateName implements ValidatorProtocol {
  validate (input: any): Error | undefined {
    if (input.name.match(/[^a-zA-Z .']/g)) return new InvalidParamError('name')
  }
}
