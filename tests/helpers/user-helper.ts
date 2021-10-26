import { IUser } from '@/domain'

import { ICollectionMethods } from '@/infra/database/protocols'

import { makeGenerateAccessToken, makeGenerateRefreshToken } from '@/factories/providers/token'

import { makeFakeUser } from '../__mocks__'

type AccessToken = string
type RefreshToken = string

export const userHelper = {
  login: async (user: IUser): Promise<[AccessToken, RefreshToken]> => {
    const accessToken = makeGenerateAccessToken().generate(user)
    const refreshToken = await makeGenerateRefreshToken().generate(user)

    return [accessToken, refreshToken]
  },
  create: async (collection: ICollectionMethods, userProperty?: Record<string, string>): Promise<IUser> => {
    const fakeUser = makeFakeUser()
    await collection.insertOne(fakeUser)

    return fakeUser
  }
}
