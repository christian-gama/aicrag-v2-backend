import { ValidateName, ValidatorProtocol } from '@/application/usecases/validators/account'

export const makeSut = (): ValidatorProtocol => {
  const sut = new ValidateName()

  return sut
}
