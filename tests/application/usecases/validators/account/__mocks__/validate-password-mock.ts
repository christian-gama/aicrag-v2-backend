import { ValidatePassword, ValidatorProtocol } from '@/application/usecases/validators/account'

export const makeSut = (): ValidatorProtocol => {
  const sut = new ValidatePassword()

  return sut
}
