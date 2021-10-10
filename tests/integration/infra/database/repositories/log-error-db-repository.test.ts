import { ILogError } from '@/domain'
import { CreateLogErrorRepositoryProtocol } from '@/domain/repositories'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { CollectionProtocol } from '@/infra/database/protocols'
import { LogErrorDbRepository } from '@/infra/database/repositories'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'

import { makeFakeLogError, makeCreateLogErrorRepositoryStub } from '@/tests/__mocks__'

interface SutTypes {
  error: Error
  fakeLogError: ILogError
  createLogErrorRepositoryStub: CreateLogErrorRepositoryProtocol
  sut: LogErrorDbRepository
}

const makeSut = (): SutTypes => {
  const database = makeMongoDb()
  const error = new Error('any_error')
  const fakeLogError = makeFakeLogError(error)
  const createLogErrorRepositoryStub = makeCreateLogErrorRepositoryStub(fakeLogError)

  const sut = new LogErrorDbRepository(createLogErrorRepositoryStub, database)

  return { createLogErrorRepositoryStub, error, fakeLogError, sut }
}

describe('logErrorDbRepository', () => {
  const client = makeMongoDb()
  let logCollection: CollectionProtocol

  afterAll(async () => {
    await client.disconnect()
  })

  beforeAll(async () => {
    await MongoAdapter.connect(global.__MONGO_URI__)

    logCollection = client.collection('logs')
  })

  beforeEach(async () => {
    await logCollection.deleteMany({})
  })

  it('should call createLog with correct error', async () => {
    expect.hasAssertions()

    const { createLogErrorRepositoryStub, error, sut } = makeSut()
    const createLogSpy = jest.spyOn(createLogErrorRepositoryStub, 'createLog')

    await sut.saveLog(error)

    expect(createLogSpy).toHaveBeenCalledWith(error)
  })

  it('should save a log error on database', async () => {
    expect.hasAssertions()

    const { error, fakeLogError, sut } = makeSut()

    const log = await sut.saveLog(error)

    const { _id, ...obj } = log as any

    expect(obj).toStrictEqual({
      date: fakeLogError.date,
      message: fakeLogError.message,
      name: fakeLogError.name,
      stack: fakeLogError.stack
    })
  })
})
