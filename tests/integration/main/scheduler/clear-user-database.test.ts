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
  let userCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    userCollection = MongoHelper.getCollection('users')
    await userCollection.deleteMany({})
  })

  it('Should delete a inactive that has createad an account more than 24 hours ago', async () => {
    const { sut } = makeSut()
    const fakeUser1 = makeFakeUser()
    fakeUser1.logs.createdAt = new Date(Date.now() - 25 * 60 * 60 * 1000)
    await userCollection.insertOne(fakeUser1)

    const fakeUser2 = makeFakeUser()
    fakeUser2.logs.createdAt = new Date(Date.now() - 25 * 60 * 60 * 1000)
    await userCollection.insertOne(fakeUser2)

    const count = await sut.deleteInactiveUsers()

    expect(count).toBe(2)
  })

  it('Should not delete users that are active', async () => {
    const { sut } = makeSut()
    const fakeUser = makeFakeUser()
    fakeUser.settings.accountActivated = true
    fakeUser.logs.createdAt = new Date(Date.now() - 25 * 60 * 60 * 1000)
    await userCollection.insertOne(fakeUser)

    const count = await sut.deleteInactiveUsers()

    expect(count).toBe(0)
  })

  it('Should not delete users that are inactive and account creation did is lower than 24 hours', async () => {
    const { sut } = makeSut()
    const fakeUser = makeFakeUser()
    fakeUser.settings.accountActivated = false
    fakeUser.logs.createdAt = new Date(Date.now() - 23 * 60 * 60 * 1000)
    await userCollection.insertOne(fakeUser)

    const count = await sut.deleteInactiveUsers()

    expect(count).toBe(0)
  })

  it('Should call saveLog if throws', async () => {
    const { sut, error, logErrorDbRepositoryStub } = makeSut()
    const saveLogSpy = jest.spyOn(logErrorDbRepositoryStub, 'saveLog')
    jest.spyOn(MongoHelper, 'getCollection').mockImplementationOnce(() => {
      throw error
    })

    await sut.deleteInactiveUsers()

    expect(saveLogSpy).toHaveBeenCalledWith(error)
  })
})
