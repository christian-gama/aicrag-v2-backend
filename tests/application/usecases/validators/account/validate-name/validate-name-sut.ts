import { ValidateName, ValidatorProtocol } from '@/application/usecases/validators/user-validator'

interface SutTypes {
  sut: ValidatorProtocol
}

export const makeSut = (): SutTypes => {
  const sut = new ValidateName()

  return { sut }
}
