import { IUser } from '@/domain'
import { ILogErrorRepository } from '@/domain/repositories'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'

import { ClearUserDatabase } from '@/main/scheduler/clear-user-database'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'

import { makeFakeUser, makeLogErrorRepositoryStub } from '@/tests/__mocks__'

interface SutTypes {
  sut: ClearUserDatabase
  error: Error
  logErrorRepositoryStub: ILogErrorRepository
}

const makeSut = (): SutTypes => {
  const error = new Error('any_message')
  const database = makeMongoDb()
  const logErrorRepositoryStub = makeLogErrorRepositoryStub(error)

  const sut = new ClearUserDatabase(database, logErrorRepositoryStub)

  return { error, logErrorRepositoryStub, sut }
}

describe('clearUserDatabase', () => {
  const client = makeMongoDb()
  let fakeUser: IUser
  let userCollection: ICollectionMethods

  afterAll(async () => {
    await client.disconnect()
  })

  afterEach(async () => {
    await userCollection.deleteMany({})
  })

  beforeAll(async () => {
    await MongoAdapter.connect(global.__MONGO_URI__)
  })

  beforeEach(async () => {
    fakeUser = makeFakeUser()
    userCollection = client.collection('users')
  })

  it('should delete a inactive user that has createad an account more than 24 hours ago', async () => {
    expect.hasAssertions()

    const { sut } = makeSut()
    fakeUser.logs.createdAt = new Date(Date.now() - 25 * 60 * 60 * 1000)
    await userCollection.insertOne(fakeUser)

    const count = await sut.deleteInactiveUsers()

    expect(count).toBe(1)
  })

  it('should not delete users that are active', async () => {
    expect.hasAssertions()

    const { sut } = makeSut()
    fakeUser.settings.accountActivated = true
    fakeUser.logs.createdAt = new Date(Date.now() - 25 * 60 * 60 * 1000)
    await userCollection.insertOne(fakeUser)

    const count = await sut.deleteInactiveUsers()

    expect(count).toBe(0)
  })

  it('should not delete users that are inactive and account creation did is lower than 24 hours', async () => {
    expect.hasAssertions()

    const { sut } = makeSut()
    fakeUser.settings.accountActivated = false
    fakeUser.logs.createdAt = new Date(Date.now() - 23 * 60 * 60 * 1000)
    await userCollection.insertOne(fakeUser)

    const count = await sut.deleteInactiveUsers()

    expect(count).toBe(0)
  })
})
