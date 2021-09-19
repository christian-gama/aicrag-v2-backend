import faker from 'faker'
import { IRefreshToken } from '@/domain/refresh-token/refresh-token-protocol'

export const makeFakeRefreshToken = (): IRefreshToken => {
  return {
    userId: faker.datatype.uuid(),
    version: 1
  }
}
