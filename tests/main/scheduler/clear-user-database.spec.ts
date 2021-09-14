import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'
import { env } from '@/main/config/env'
import { makeFakeUser } from '@/tests/__mocks__/domain/mock-user'
import { makeSut } from './clear-user-database-sut'

import { Collection } from 'mongodb'

describe('ClearUserDatabase', () => {
  let userCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(env.DB.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    userCollection = await MongoHelper.getCollection('users')
    await userCollection.deleteMany({})
  })

  it('Should delete a inactive that has createad an account more than 24 hours ago', async () => {
    const { sut } = makeSut()
    const fakeUser1 = makeFakeUser()
    fakeUser1.logs.createdAt = new Date(Date.now() - 24.1 * 60 * 60 * 1000)
    await userCollection.insertOne(fakeUser1)

    const fakeUser2 = makeFakeUser()
    fakeUser2.logs.createdAt = new Date(Date.now() - 48.5 * 60 * 60 * 1000)
    await userCollection.insertOne(fakeUser2)

    // Should not delete this one
    const fakeUser3 = makeFakeUser()
    fakeUser3.logs.createdAt = new Date(Date.now() - 18.5 * 60 * 60 * 1000)
    await userCollection.insertOne(fakeUser3)

    const count = await sut.deleteInactiveUsers()

    expect(count).toBe(2)
  })
})
