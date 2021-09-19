import faker from 'faker'
import { RefreshToken } from '@/domain/refresh-token/refresh-token-protocol'

export const makeFakeRefreshToken = (): RefreshToken => {
  return {
    userId: faker.datatype.uuid(),
    version: 1
  }
}
