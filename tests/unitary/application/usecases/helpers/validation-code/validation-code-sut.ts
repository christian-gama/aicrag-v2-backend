import {
  ValidationCode,
  ValidationCodeProtocol
} from '@/application/usecases/helpers/validation-code/'

interface SutTypes {
  sut: ValidationCodeProtocol
}

export const makeSut = (): SutTypes => {
  const sut = new ValidationCode()

  return { sut }
}
