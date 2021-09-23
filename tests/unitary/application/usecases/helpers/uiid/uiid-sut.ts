import { UuidProtocol } from '@/application/protocols/helpers'
import { Uuid } from '@/application/usecases/helpers'

interface SutTypes {
  sut: UuidProtocol
}

export const makeSut = (): SutTypes => {
  const sut = new Uuid()

  return { sut }
}
