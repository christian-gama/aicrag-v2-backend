import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'

import { makeGenerateAccessToken, makeGenerateRefreshToken } from '@/main/factories/providers/token'
import app from '@/main/vendors/express/config/app'
import { protectedMiddleware } from '@/main/vendors/express/routes'

import { makeFakeUser } from '@/tests/__mocks__'

import { Collection } from 'mongodb'
import request from 'supertest'

describe('ProtectedMiddleware', () => {
  let accessToken: string
  let refreshToken: string
  let userCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)

    userCollection = MongoHelper.getCollection('users')

    const fakeUser = makeFakeUser()
    await userCollection.insertOne(fakeUser)
    refreshToken = await makeGenerateRefreshToken().generate(fakeUser)
    accessToken = makeGenerateAccessToken().generate(fakeUser)

    app.get('/protected', protectedMiddleware, (req, res) => {
      res.send()
    })
  })

  afterAll(async () => {
    await userCollection.deleteMany({})
    await MongoHelper.disconnect()
  })

  const agent = request.agent(app)

  it('Should return 401 if refresh token is invalid', async () => {
    await agent.get('/protected').expect(401)
  })

  it('Should return 401 if access token is invalid', async () => {
    await agent
      .get('/protected')
      .set('Cookie', `refreshToken=${refreshToken};accessToken=invalid_token`)
      .expect(401)
  })

  it('Should return 200 if refresh token and access token are valid', async () => {
    await agent
      .get('/protected')
      .set('Cookie', `refreshToken=${refreshToken};accessToken=${accessToken}`)
      .expect(200)
  })
})
