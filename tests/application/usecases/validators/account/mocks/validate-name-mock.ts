import { AccountValidatorProtocol } from '@/application/protocols/validators/account/account-validator-protocol'
import { ValidateName } from '@/application/usecases/validators/account'

export const makeSut = (): AccountValidatorProtocol => {
  const sut = new ValidateName()

  return sut
}
