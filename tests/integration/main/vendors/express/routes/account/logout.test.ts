import { IUser } from '@/domain'

import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'

import { makeGenerateRefreshToken } from '@/main/factories/providers/token'
import app from '@/main/vendors/express/config/app'

import { makeFakeUser } from '@/tests/__mocks__'

import { Collection } from 'mongodb'
import request from 'supertest'

describe('GET /logout', () => {
  let fakeUser: IUser
  let refreshToken: string
  let userCollection: Collection

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  afterEach(async () => {
    await userCollection.deleteMany({})
  })

  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)

    userCollection = MongoHelper.getCollection('users')
  })

  beforeEach(async () => {
    fakeUser = makeFakeUser()
    refreshToken = await makeGenerateRefreshToken().generate(fakeUser)
  })

  const agent = request.agent(app)

  it('Should return 200 if user is logged in', async () => {
    await userCollection.insertOne(fakeUser)

    await agent
      .get('/api/v1/account/logout')
      .set('Cookie', `refreshToken=${refreshToken}`)
      .expect(200)
  })

  it('Should return 401 if user is logged out', async () => {
    await agent.get('/api/v1/account/logout').expect(403)
  })
})
