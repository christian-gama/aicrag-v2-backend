import { Validation } from '@/application/validators/protocols/validation-protocol'
import { ValidateName } from '@/application/validators/account/validate-name'

export const makeSut = (): Validation => {
  const sut = new ValidateName()

  return sut
}
