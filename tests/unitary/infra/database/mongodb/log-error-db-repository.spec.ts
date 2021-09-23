import { LogErrorRepositoryProtocol } from '@/application/protocols/repositories'
import { ILogError } from '@/domain'
import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'
import { LogErrorDbRepository } from '@/infra/database/mongodb/repositories'
import { makeFakeLogError, makeLogErrorRepositoryStub } from '@/tests/__mocks__'

import { Collection } from 'mongodb'

interface SutTypes {
  sut: LogErrorDbRepository
  error: Error
  fakeLogError: ILogError
  logErrorRepositoryStub: LogErrorRepositoryProtocol
}

const makeSut = (): SutTypes => {
  const error = new Error('any_error')
  const fakeLogError = makeFakeLogError(error)
  const logErrorRepositoryStub = makeLogErrorRepositoryStub(fakeLogError)
  const sut = new LogErrorDbRepository(logErrorRepositoryStub)

  return { sut, error, fakeLogError, logErrorRepositoryStub }
}

describe('LogErrorDbRepository', () => {
  let logCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    logCollection = MongoHelper.getCollection('logs')
    await logCollection.deleteMany({})
  })

  it('Should call createLog with correct error', async () => {
    const { sut, error, logErrorRepositoryStub } = makeSut()
    const createLogSpy = jest.spyOn(logErrorRepositoryStub, 'createLog')

    await sut.saveLog(error)

    expect(createLogSpy).toHaveBeenCalledWith(error)
  })

  it('Should save a log error on database', async () => {
    const { sut, error, fakeLogError } = makeSut()

    const value = await sut.saveLog(error)

    expect(value.name).toEqual(fakeLogError.name)
    expect(value.date).toEqual(fakeLogError.date)
    expect(value.message).toEqual(fakeLogError.message)
    expect(value.stack).toEqual(fakeLogError.stack)
  })
})
