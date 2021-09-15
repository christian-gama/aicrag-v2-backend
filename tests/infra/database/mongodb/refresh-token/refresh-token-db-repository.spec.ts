import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'
import { env } from '@/main/config/env'
import { makeFakeRefreshToken } from '@/tests/__mocks__/domain/mock-refresh-token'
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

  describe('findRefreshTokenById', () => {
    it('Should return a RefreshToken if finds it', async () => {
      const { sut } = makeSut()
      const fakeRefreshToken = makeFakeRefreshToken()

      await refreshTokenCollection.insertOne(fakeRefreshToken)
      const refreshToken = await sut.findRefreshTokenById(fakeRefreshToken.id)

      expect(refreshToken).toHaveProperty('_id')
      expect(refreshToken).toHaveProperty('id')
      expect(refreshToken).toHaveProperty('expiresIn')
      expect(refreshToken).toHaveProperty('userId')
    })

    it('Should return undefined if does not find a RefreshToken', async () => {
      const { sut, fakeUser } = makeSut()

      const refreshToken = await sut.findRefreshTokenById(fakeUser.personal.id)

      expect(refreshToken).toBe(undefined)
    })
  })

  describe('DeleteRefreshTokenById', () => {
    it('Should return deleted count 0 if does not find any refresh token', async () => {
      const { sut } = makeSut()
      const fakeRefreshToken = makeFakeRefreshToken()

      const fakeUserId = fakeRefreshToken.userId
      const deletedCount = await sut.deleteRefreshTokenById(fakeUserId)

      expect(deletedCount).toBe(0)
    })

    it('Should return count 2 if finds two deleted refresh tokens', async () => {
      const { sut } = makeSut()
      const fakeRefreshToken1 = makeFakeRefreshToken()
      await refreshTokenCollection.insertOne(fakeRefreshToken1)

      const fakeRefreshToken2 = makeFakeRefreshToken()
      fakeRefreshToken2.id = fakeRefreshToken1.id
      await refreshTokenCollection.insertOne(fakeRefreshToken2)

      const deletedCount = await sut.deleteRefreshTokenById(fakeRefreshToken1.id)

      expect(deletedCount).toBe(2)
    })
  })
})
