import { IUser } from '@/domain'

import { ICollectionMethods } from '@/infra/database/protocols'

import { makeGenerateAccessToken, makeGenerateRefreshToken } from '@/factories/providers/token'

import { makeFakeUser } from '../__mocks__'

type AccessToken = string
type RefreshToken = string

export const userHelper = {
  generateToken: async (user: IUser): Promise<[AccessToken, RefreshToken]> => {
    const accessToken = makeGenerateAccessToken().generate(user)
    const refreshToken = await makeGenerateRefreshToken().generate(user)

    return [accessToken, refreshToken]
  },
  insertUser: async (collection: ICollectionMethods, userProperty?: Record<any, any>): Promise<IUser> => {
    const fakeUser = makeFakeUser(userProperty)
    await collection.insertOne(fakeUser)

    return fakeUser
  }
}
