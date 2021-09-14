import { env } from '@/main/config/env'
import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'
import { makeSut } from './refresh-token-db-repository-sut'

import { Collection } from 'mongodb'
import { makeFakeRefreshToken } from '@/tests/__mocks__/domain/mock-refresh-token'

describe('RefreshTokenDbRepository', () => {
  let refreshTokenCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(env.DB.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    refreshTokenCollection = await MongoHelper.getCollection('refresh_tokens')
    await refreshTokenCollection.deleteMany({})
  })

  describe('SaveRefreshToken', () => {
    it('Should call createRefreshToken with correct user', async () => {
      const { sut, fakeUser, refreshTokenRepositoryStub } = makeSut()
      const createRefreshTokenSpy = jest.spyOn(refreshTokenRepositoryStub, 'createRefreshToken')

      await sut.saveRefreshToken(fakeUser.personal.id)

      expect(createRefreshTokenSpy).toHaveBeenCalledWith(fakeUser.personal.id)
    })

    it('Should save RefreshToken on database', async () => {
      const { sut, fakeUser } = makeSut()

      const refreshToken = await sut.saveRefreshToken(fakeUser.personal.id)

      expect(refreshToken).toHaveProperty('_id')
      expect(refreshToken).toHaveProperty('id')
      expect(refreshToken).toHaveProperty('expiresIn')
      expect(refreshToken).toHaveProperty('userId')
    })
  })

  describe('FindRefreshTokenByUserId', () => {
    it('Should find return a RefreshToken if finds it', async () => {
      const { sut } = makeSut()
      const fakeRefreshToken = makeFakeRefreshToken()

      const fakeUserId = fakeRefreshToken.userId
      await refreshTokenCollection.insertOne(fakeRefreshToken)
      const refreshToken = await sut.findRefreshTokenByUserId(fakeUserId)

      expect(refreshToken).toHaveProperty('_id')
      expect(refreshToken).toHaveProperty('id')
      expect(refreshToken).toHaveProperty('expiresIn')
      expect(refreshToken).toHaveProperty('userId')
    })

    it('Should return undefined if does not find a RefreshToken', async () => {
      const { sut, fakeUser } = makeSut()

      const refreshToken = await sut.findRefreshTokenByUserId(fakeUser.personal.id)

      expect(refreshToken).toBe(undefined)
    })
  })
})
