import { Uuid } from '@/application/usecases/helpers/uuid'

export const makeUuid = (): Uuid => {
  return new Uuid()
}
