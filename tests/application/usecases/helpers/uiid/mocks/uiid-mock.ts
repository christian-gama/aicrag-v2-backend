import { IUiid } from '@/application/protocols/helpers/uuid/uuid-protocol'
import { Uiid } from '@/application/usecases/helpers/uuid/uuid'

export const makeSut = (): IUiid => {
  const sut = new Uiid()

  return sut
}
