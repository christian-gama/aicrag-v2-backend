import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'
import { env } from '@/main/config/env'
import { makeSut } from './log-error-db-repository-sut'

import { Collection } from 'mongodb'

describe('LogErrorDbRepository', () => {
  let logCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(env.DB.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    logCollection = await MongoHelper.getCollection('logs')
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
