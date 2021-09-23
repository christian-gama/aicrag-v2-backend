import { ValidatorProtocol } from '@/application/protocols/validators'
import { ValidateName } from '@/application/usecases/validators'

interface SutTypes {
  sut: ValidatorProtocol
}

export const makeSut = (): SutTypes => {
  const sut = new ValidateName()

  return { sut }
}
