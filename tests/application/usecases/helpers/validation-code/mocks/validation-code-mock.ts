import { ValidationCode, ValidationCodeProtocol } from '@/application/usecases/helpers/validation-code/'

export const makeSut = (): ValidationCodeProtocol => {
  const sut = new ValidationCode()

  return sut
}
