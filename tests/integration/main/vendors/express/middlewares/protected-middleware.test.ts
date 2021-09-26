import { IUser } from '@/domain'

import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'

import { makeGenerateAccessToken, makeGenerateRefreshToken } from '@/main/factories/providers/token'
import app from '@/main/vendors/express/config/app'
import { protectedMiddleware } from '@/main/vendors/express/routes'

import { makeFakeUser } from '@/tests/__mocks__'

import { Collection } from 'mongodb'
import request from 'supertest'

describe('protectedMiddleware', () => {
  let accessToken: string
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

    app.get('/protected', protectedMiddleware, (req, res) => {
      res.send()
    })
  })

  beforeEach(async () => {
    fakeUser = makeFakeUser()
    refreshToken = await makeGenerateRefreshToken().generate(fakeUser)
    accessToken = makeGenerateAccessToken().generate(fakeUser)
  })

  const agent = request.agent(app)

  it('should return 401 if refresh token is invalid', async () => {
    expect.assertions(0)

    await agent.get('/protected').expect(401)
  })

  it('should return 401 if access token is invalid', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await agent
      .get('/protected')
      .set('Cookie', `refreshToken=${refreshToken};accessToken=invalid_token`)
      .expect(401)
  })

  it('should return 200 if refresh token and access token are valid', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await agent
      .get('/protected')
      .set('Cookie', `refreshToken=${refreshToken};accessToken=${accessToken}`)
      .expect(200)
  })
})
