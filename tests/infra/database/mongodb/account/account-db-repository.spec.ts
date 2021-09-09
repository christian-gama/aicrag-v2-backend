import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'
import { fakeValidAccount } from '@/tests/domain/mocks/account-mock'
import { Collection } from 'mongodb'
import { makeSut } from './mocks/account-db-repository-mock'

let accountCollection: Collection

describe('AccountDbRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  it('Should create a user on success of saveAccount', async () => {
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

  it('Should return a user if findAccountByEmail finds a user', async () => {
    const { sut } = makeSut()
    const user = await sut.saveAccount(fakeValidAccount)
    const user2 = await sut.findAccountByEmail(user.personal.email)

    expect(user2).toHaveProperty('_id')
  })

  it('Should return undefined if does not findAccountByEmail finds a user', async () => {
    const { sut } = makeSut()
    const user = await sut.findAccountByEmail('non_existent@email.com')

    expect(user).toBe(undefined)
  })
})
