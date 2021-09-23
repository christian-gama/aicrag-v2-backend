import { ValidatorProtocol } from '@/application/protocols/validators'
import { ValidatePassword } from '@/application/usecases/validators'

interface SutTypes {
  sut: ValidatorProtocol
}

export const makeSut = (): SutTypes => {
  const sut = new ValidatePassword()

  return { sut }
}
