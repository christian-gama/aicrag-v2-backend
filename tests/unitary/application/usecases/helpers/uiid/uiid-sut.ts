import { Uuid, UuidProtocol } from '@/application/usecases/helpers/uuid/'

interface SutTypes {
  sut: UuidProtocol
}

export const makeSut = (): SutTypes => {
  const sut = new Uuid()

  return { sut }
}
