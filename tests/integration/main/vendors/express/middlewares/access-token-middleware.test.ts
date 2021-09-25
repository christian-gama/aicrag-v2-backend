import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'

import { makeGenerateAccessToken } from '@/main/factories/providers/token'
import app from '@/main/vendors/express/config/app'
import { accessTokenMiddleware } from '@/main/vendors/express/routes'

import { makeFakeUser } from '@/tests/__mocks__'

import { Collection } from 'mongodb'
import request from 'supertest'

describe('AccessTokenMiddleware', () => {
  let accessToken: string
  let userCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)

    userCollection = MongoHelper.getCollection('users')

    app.get('/invalid-access-token', accessTokenMiddleware, (req, res) => {
      res.send()
    })

    const fakeUser = makeFakeUser()
    await userCollection.insertOne(fakeUser)
    accessToken = makeGenerateAccessToken().generate(fakeUser)

    app.get('/valid-access-token', accessTokenMiddleware, (req, res) => {
      res.send()
    })
  })

  afterAll(async () => {
    await userCollection.deleteMany({})
    await MongoHelper.disconnect()
  })

  const agent = request.agent(app)

  it('Should return 401 if there is an invalid access token', async () => {
    await agent.get('/invalid-access-token').expect(401)
  })

  it('Should return 200 if there is a valid access token', async () => {
    await agent.get('/valid-access-token').set('Cookie', `accessToken=${accessToken}`).expect(200)
  })
})
