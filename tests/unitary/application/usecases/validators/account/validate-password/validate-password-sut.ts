import { ValidatePassword, ValidatorProtocol } from '@/application/usecases/validators/user-validator'

interface SutTypes {
  sut: ValidatorProtocol
}

export const makeSut = (): SutTypes => {
  const sut = new ValidatePassword()

  return { sut }
}
