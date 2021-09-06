import { AccountValidatorProtocol } from '@/application/protocols/validators/account/account-validator-protocol'
import { ComparePasswords } from '@/application/usecases/validators/account'

export const makeSut = (): AccountValidatorProtocol => {
  const sut = new ComparePasswords()

  return sut
}
