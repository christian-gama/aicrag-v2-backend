import { Uuid, UuidProtocol } from '@/application/usecases/helpers/uuid/'

export const makeSut = (): UuidProtocol => {
  const sut = new Uuid()

  return sut
}
