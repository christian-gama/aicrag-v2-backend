import { ValidatePasswordComparasion, ValidatorProtocol } from '@/application/usecases/validators/account'

interface SutTypes {
  sut: ValidatorProtocol
}

export const makeSut = (): SutTypes => {
  const sut = new ValidatePasswordComparasion()

  return { sut }
}
