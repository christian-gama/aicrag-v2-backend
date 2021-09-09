import { Uuid } from '@/application/usecases/helpers/uuid/uuid'

export const makeUuid = (): Uuid => {
  return new Uuid()
}
