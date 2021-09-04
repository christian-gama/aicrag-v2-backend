import { IUiid } from '@/application/helpers/uuid/uuid-protocol'
import { Uiid } from '@/infra/helpers/uuid/uuid'

export const makeSut = (): IUiid => {
  const sut = new Uiid()

  return sut
}
