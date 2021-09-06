import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'
import { fakeValidAccount } from '@/tests/domain/mocks/account-mock'
import { Collection } from 'mongodb'
import { makeSut } from './mocks/account-mongo-repository-mock'

let accountCollection: Collection

describe('', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  it('Should create a user on success', async () => {
    const { sut, fakeUser } = makeSut()
    const user = await sut.saveAccount(fakeValidAccount)

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
