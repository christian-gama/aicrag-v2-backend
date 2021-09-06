import { IUuid } from '@/application/protocols/helpers/uuid/uuid-protocol'
import { Uuid } from '@/application/usecases/helpers/uuid/uuid'

export const makeSut = (): IUuid => {
  const sut = new Uuid()

  return sut
}
