import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { ComparePasswords } from '@/application/usecases/validators/account'

export const makeSut = (): ValidatorProtocol => {
  const sut = new ComparePasswords()

  return sut
}
