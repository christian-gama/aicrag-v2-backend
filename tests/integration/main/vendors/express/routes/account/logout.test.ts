import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'
import { makeGenerateRefreshToken } from '@/main/factories/providers/token'
import app from '@/main/vendors/express/config/app'
import { isLoggedInMiddleware, logoutController } from '@/main/vendors/express/routes'
import { makeFakeUser } from '@/tests/__mocks__'

import { Collection } from 'mongodb'
import request from 'supertest'

describe('GET /logout', () => {
  let refreshToken: string
  let userCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)

    userCollection = MongoHelper.getCollection('users')

    const fakeUser = makeFakeUser()
    await userCollection.insertOne(fakeUser)
    refreshToken = await makeGenerateRefreshToken().generate(fakeUser)

    app.get('/api/v1/account/logout', isLoggedInMiddleware, logoutController)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  afterEach(async () => {
    await userCollection.deleteMany({})
  })

  const agent = request.agent(app)

  it('Should return 200 if user is logged in', async () => {
    await agent.get('/api/v1/account/logout').set('Cookie', `refreshToken=${refreshToken}`).expect(200)
  })

  it('Should return 401 if user is logged out', async () => {
    await agent.get('/api/v1/account/logout').expect(403)
  })
})
