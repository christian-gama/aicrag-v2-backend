import { Uuid } from '@/application/helpers/uuid'

export const makeUuid = (): Uuid => {
  return new Uuid()
}
