import faker from 'faker'
import { IRefreshToken } from '@/application/protocols/providers'

export const makeFakeRefreshToken = (): IRefreshToken => {
  return {
    userId: faker.datatype.uuid(),
    version: 1
  }
}
