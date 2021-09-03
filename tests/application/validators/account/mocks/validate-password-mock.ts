import { Validation } from '@/application/validators/protocols/validation-protocol'
import { ValidatePassword } from '@/application/validators/account'

export const makeSut = (): Validation => {
  const sut = new ValidatePassword()

  return sut
}
