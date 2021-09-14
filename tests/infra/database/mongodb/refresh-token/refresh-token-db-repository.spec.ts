import { env } from '@/main/config/env'
import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'
import { makeSut } from './refresh-token-db-repository-sut'

import { Collection } from 'mongodb'

describe('RefreshTokenDbRepository', () => {
  let refreshTokenCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(env.DB.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    refreshTokenCollection = await MongoHelper.getCollection('users')
    await refreshTokenCollection.deleteMany({})
  })

  it('Should call createRefreshToken with correct user', async () => {
    const { sut, fakeUser, refreshTokenRepositoryStub } = makeSut()
    const createRefreshTokenSpy = jest.spyOn(refreshTokenRepositoryStub, 'createRefreshToken')

    await sut.saveRefreshToken(fakeUser)

    expect(createRefreshTokenSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('Should save RefreshToken on database', async () => {
    const { sut, fakeUser } = makeSut()

    const refreshToken = await sut.saveRefreshToken(fakeUser)

    expect(refreshToken).toHaveProperty('_id')
    expect(refreshToken).toHaveProperty('id')
    expect(refreshToken).toHaveProperty('expiresIn')
    expect(refreshToken).toHaveProperty('user')
    expect(refreshToken).toHaveProperty('userId')
  })
})
