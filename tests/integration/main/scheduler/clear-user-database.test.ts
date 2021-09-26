import { IUser } from '@/domain'

import { LogErrorDbRepositoryProtocol } from '@/application/protocols/repositories'

import { MongoHelper } from '@/infra/database/mongodb/helper'

import { ClearUserDatabase } from '@/main/scheduler/clear-user-database'

import { makeFakeUser, makeLogErrorDbRepositoryStub } from '@/tests/__mocks__'

import { Collection } from 'mongodb'

interface SutTypes {
  sut: ClearUserDatabase
  error: Error
  logErrorDbRepositoryStub: LogErrorDbRepositoryProtocol
}

const makeSut = (): SutTypes => {
  const error = new Error('any_message')
  const logErrorDbRepositoryStub = makeLogErrorDbRepositoryStub(error)

  const sut = new ClearUserDatabase(logErrorDbRepositoryStub)

  return { sut, error, logErrorDbRepositoryStub }
}

describe('ClearUserDatabase', () => {
  let fakeUser: IUser
  let userCollection: Collection

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  afterEach(async () => {
    await userCollection.deleteMany({})
  })

  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)
  })

  beforeEach(async () => {
    fakeUser = makeFakeUser()
    userCollection = MongoHelper.getCollection('users')
  })

  it('Should delete a inactive user that has createad an account more than 24 hours ago', async () => {
    const { sut } = makeSut()
    fakeUser.logs.createdAt = new Date(Date.now() - 25 * 60 * 60 * 1000)
    await userCollection.insertOne(fakeUser)

    const count = await sut.deleteInactiveUsers()

    expect(count).toBe(1)
  })

  it('Should not delete users that are active', async () => {
    const { sut } = makeSut()
    fakeUser.settings.accountActivated = true
    fakeUser.logs.createdAt = new Date(Date.now() - 25 * 60 * 60 * 1000)
    await userCollection.insertOne(fakeUser)

    const count = await sut.deleteInactiveUsers()

    expect(count).toBe(0)
  })

  it('Should not delete users that are inactive and account creation did is lower than 24 hours', async () => {
    const { sut } = makeSut()
    fakeUser.settings.accountActivated = false
    fakeUser.logs.createdAt = new Date(Date.now() - 23 * 60 * 60 * 1000)
    await userCollection.insertOne(fakeUser)

    const count = await sut.deleteInactiveUsers()

    expect(count).toBe(0)
  })
})
