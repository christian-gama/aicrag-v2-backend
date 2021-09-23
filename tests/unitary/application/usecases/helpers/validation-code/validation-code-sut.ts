import { ValidationCodeProtocol } from '@/application/protocols/helpers'
import { ValidationCode } from '@/application/usecases/helpers'

interface SutTypes {
  sut: ValidationCodeProtocol
}

export const makeSut = (): SutTypes => {
  const sut = new ValidationCode()

  return { sut }
}
