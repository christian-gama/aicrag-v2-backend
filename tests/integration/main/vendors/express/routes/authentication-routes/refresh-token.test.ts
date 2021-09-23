import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'
import { accessTokenMiddleware, refreshTokenMiddleware } from '@/main/vendors/express/routes/.'
import app from '@/main/vendors/express/config/app'
import { makeGenerateRefreshToken } from '@/main/factories/providers/token/generate-refresh-token-factory'
import { makeFakeUser } from '@/tests/__mocks__/domain/mock-user'

import { Collection } from 'mongodb'
import request from 'supertest'

describe('RefreshTokenMiddleware', () => {
  let refreshToken: string
  let userCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)

    userCollection = MongoHelper.getCollection('users')

    app.get('/invalid-refresh-token', refreshTokenMiddleware, (req, res) => {
      res.send()
    })

    const fakeUser = makeFakeUser()
    await userCollection.insertOne(fakeUser)
    refreshToken = await makeGenerateRefreshToken().generate(fakeUser)

    app.get('/valid-refresh-token', refreshTokenMiddleware, accessTokenMiddleware, (req, res) => {
      res.send()
    })
  })

  afterAll(async () => {
    await userCollection.deleteMany({})
    await MongoHelper.disconnect()
  })

  const agent = request.agent(app)

  it('Should return 401 if there is an invalid refresh token', async () => {
    await agent.get('/invalid-refresh-token').expect(401)
  })

  it('Should return 200 if there is a valid refresh token', async () => {
    await agent.get('/valid-refresh-token').set('Cookie', `refreshToken=${refreshToken}`).expect(200)
  })
})
