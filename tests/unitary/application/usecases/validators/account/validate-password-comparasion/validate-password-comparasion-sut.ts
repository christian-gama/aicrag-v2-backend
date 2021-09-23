import { ValidatorProtocol } from '@/application/protocols/validators'
import { ValidatePasswordComparasion } from '@/application/usecases/validators'

interface SutTypes {
  sut: ValidatorProtocol
}

export const makeSut = (): SutTypes => {
  const sut = new ValidatePasswordComparasion()

  return { sut }
}
