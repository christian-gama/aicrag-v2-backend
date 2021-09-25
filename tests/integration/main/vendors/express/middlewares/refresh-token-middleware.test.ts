import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'

import { makeGenerateRefreshToken } from '@/main/factories/providers/token'
import app from '@/main/vendors/express/config/app'
import { refreshTokenMiddleware, accessTokenMiddleware } from '@/main/vendors/express/routes'

import { makeFakeUser } from '@/tests/__mocks__'

import { Collection } from 'mongodb'
import request from 'supertest'

describe('RefreshTokenMiddleware', () => {
  let refreshToken: string
  let userCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)

    userCollection = MongoHelper.getCollection('users')

    app.get('/invalid-refresh-token', refreshTokenMiddleware, accessTokenMiddleware, (req, res) => {
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
