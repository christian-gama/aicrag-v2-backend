import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { ValidatePassword } from '@/application/usecases/validators/account'

export const makeSut = (): ValidatorProtocol => {
  const sut = new ValidatePassword()

  return sut
}
