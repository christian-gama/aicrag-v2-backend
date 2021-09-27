import { IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongo-adapter'

import { makeGenerateRefreshToken } from '@/main/factories/providers/token'
import app from '@/main/vendors/express/config/app'

import { makeFakeUser } from '@/tests/__mocks__'

import { Collection } from 'mongodb'
import request from 'supertest'

describe('get /logout', () => {
  let fakeUser: IUser
  let refreshToken: string
  let userCollection: Collection

  afterAll(async () => {
    await MongoAdapter.disconnect()
  })

  afterEach(async () => {
    await userCollection.deleteMany({})
  })

  beforeAll(async () => {
    await MongoAdapter.connect(global.__MONGO_URI__)

    userCollection = MongoAdapter.getCollection('users')
  })

  beforeEach(async () => {
    fakeUser = makeFakeUser()
    refreshToken = await makeGenerateRefreshToken().generate(fakeUser)
  })

  const agent = request.agent(app)

  it('should return 200 if user is logged in', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await agent
      .get('/api/v1/account/logout')
      .set('Cookie', `refreshToken=${refreshToken}`)
      .expect(200)
  })

  it('should return 401 if user is logged out', async () => {
    expect.assertions(0)

    await agent.get('/api/v1/account/logout').expect(403)
  })
})
