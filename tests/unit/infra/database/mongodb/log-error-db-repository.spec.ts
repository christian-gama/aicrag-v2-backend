import { ILogError } from '@/domain'

import { LogErrorRepositoryProtocol } from '@/application/protocols/repositories'

import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'
import { LogErrorDbRepository } from '@/infra/database/mongodb/repositories'

import { makeFakeLogError, makeLogErrorRepositoryStub } from '@/tests/__mocks__'

import { Collection } from 'mongodb'

interface SutTypes {
  error: Error
  fakeLogError: ILogError
  logErrorRepositoryStub: LogErrorRepositoryProtocol
  sut: LogErrorDbRepository
}

const makeSut = (): SutTypes => {
  const error = new Error('any_error')
  const fakeLogError = makeFakeLogError(error)
  const logErrorRepositoryStub = makeLogErrorRepositoryStub(fakeLogError)

  const sut = new LogErrorDbRepository(logErrorRepositoryStub)

  return { error, fakeLogError, logErrorRepositoryStub, sut }
}

describe('logErrorDbRepository', () => {
  let logCollection: Collection

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)

    logCollection = MongoHelper.getCollection('logs')
  })

  beforeEach(async () => {
    await logCollection.deleteMany({})
  })

  it('should call createLog with correct error', async () => {
    expect.hasAssertions()

    const { sut, error, logErrorRepositoryStub } = makeSut()
    const createLogSpy = jest.spyOn(logErrorRepositoryStub, 'createLog')

    await sut.saveLog(error)

    expect(createLogSpy).toHaveBeenCalledWith(error)
  })

  it('should save a log error on database', async () => {
    expect.hasAssertions()

    const { error, fakeLogError, sut } = makeSut()

    const value = await sut.saveLog(error)

    expect(value.date).toStrictEqual(fakeLogError.date)
    expect(value.message).toStrictEqual(fakeLogError.message)
    expect(value.name).toStrictEqual(fakeLogError.name)
    expect(value.stack).toStrictEqual(fakeLogError.stack)
  })
})
