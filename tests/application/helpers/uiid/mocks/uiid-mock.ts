import { IUiid } from '@/domain/uuid/uuid-protocol'
import { Uiid } from '@/application/helpers/uiid/uuid'

export const makeSut = (): IUiid => {
  const sut = new Uiid()

  return sut
}
