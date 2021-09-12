import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'
import { env } from '@/main/config/env'
import { makeSut } from './__mocks__/account-db-repository-mock'
import { makeFakeValidAccount } from '@/tests/domain/__mocks__/account-mock'

import { Collection } from 'mongodb'

describe('AccountDbRepository', () => {
  let accountCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(env.DB.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('saveAccount', () => {
    it('Should create a user on success', async () => {
      const { sut, fakeUser } = makeSut()
      const user = await sut.saveAccount(makeFakeValidAccount())

      expect(user).toHaveProperty('_id')
      expect(user.personal).toEqual({
        id: fakeUser.personal.id,
        name: fakeUser.personal.name,
        email: fakeUser.personal.email,
        password: fakeUser.personal.password
      })

      expect(user.settings).toEqual({
        accountActivated: fakeUser.settings.accountActivated,
        handicap: fakeUser.settings.handicap,
        currency: fakeUser.settings.currency
      })

      expect(user.logs).toEqual({
        createdAt: fakeUser.logs.createdAt,
        lastLoginAt: fakeUser.logs.lastLoginAt,
        lastSeenAt: fakeUser.logs.lastSeenAt,
        updatedAt: fakeUser.logs.updatedAt
      })

      expect(user.temporary?.activationCode).toBe(fakeUser.temporary?.activationCode)
    })
  })

  describe('findAccountByEmail', () => {
    it('Should return a user if findAccountByEmail finds a user', async () => {
      const { sut } = makeSut()
      const user = await sut.saveAccount(makeFakeValidAccount())
      const user2 = await sut.findAccountByEmail(user.personal.email)

      expect(user2).toHaveProperty('_id')
    })

    it('Should return undefined if does not findAccountByEmail finds a user', async () => {
      const { sut } = makeSut()
      const user = await sut.findAccountByEmail('non_existent@email.com')

      expect(user).toBe(undefined)
    })
  })
})
