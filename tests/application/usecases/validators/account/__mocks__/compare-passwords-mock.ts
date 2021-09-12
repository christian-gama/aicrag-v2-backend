import { ComparePasswords, ValidatorProtocol } from '@/application/usecases/validators/account'

export const makeSut = (): ValidatorProtocol => {
  const sut = new ComparePasswords()

  return sut
}
