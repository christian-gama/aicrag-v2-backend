import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { ValidateName } from '@/application/usecases/validators/account'

export const makeSut = (): ValidatorProtocol => {
  const sut = new ValidateName()

  return sut
}
