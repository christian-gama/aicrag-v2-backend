import { makeFakeUser } from './mock-user'

import faker from 'faker'
import { RefreshToken } from '@/domain/refresh-token/refresh-token-protocol'

const fakeUser = makeFakeUser()

export const makeFakeRefreshToken = (): RefreshToken => {
  return {
    id: faker.datatype.uuid(),
    expiresIn: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    user: fakeUser,
    userId: fakeUser.personal.id
  }
}
