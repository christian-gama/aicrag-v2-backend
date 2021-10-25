import { ILogError } from '@/domain'
import { ICreateLogErrorRepository } from '@/domain/repositories'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'
import { LogErrorRepository } from '@/infra/database/repositories'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'

import { makeFakeLogError, makeCreateLogErrorRepositoryStub } from '@/tests/__mocks__'

interface SutTypes {
  error: Error
  fakeLogError: ILogError
  createLogErrorRepositoryStub: ICreateLogErrorRepository
  sut: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const database = makeMongoDb()
  const error = new Error('any_error')
  const fakeLogError = makeFakeLogError(error)
  const createLogErrorRepositoryStub = makeCreateLogErrorRepositoryStub(fakeLogError)

  const sut = new LogErrorRepository(createLogErrorRepositoryStub, database)

  return { createLogErrorRepositoryStub, error, fakeLogError, sut }
}

describe('logErrorRepository', () => {
  const client = makeMongoDb()
  let logCollection: ICollectionMethods

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

  describe('create', () => {
    it('should call create with correct error', async () => {
      expect.hasAssertions()

      const { sut, error, createLogErrorRepositoryStub } = makeSut()
      const createLogSpy = jest.spyOn(createLogErrorRepositoryStub, 'create')

      await sut.save(error)

      expect(createLogSpy).toHaveBeenCalledWith(error)
    })

    it('should save a log error on database', async () => {
      expect.hasAssertions()

      const { error, fakeLogError, sut } = makeSut()

      const log = await sut.save(error)

      const { _id, ...obj } = log as any

      expect(obj).toStrictEqual({
        date: fakeLogError.date,
        message: fakeLogError.message,
        name: fakeLogError.name,
        stack: fakeLogError.stack
      })
    })
  })
})
