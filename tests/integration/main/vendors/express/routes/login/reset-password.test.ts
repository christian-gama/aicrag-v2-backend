import { IUser } from '@/domain'

import { MongoHelper } from '@/infra/database/mongodb/helper'

import { makeGenerateRefreshToken, makeGenerateAccessToken } from '@/main/factories/providers/token'
import app from '@/main/vendors/express/config/app'

import { makeFakeUser } from '@/tests/__mocks__'

import { Collection } from 'mongodb'
import request from 'supertest'

describe('POST /reset-password', () => {
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
  })

  beforeEach(async () => {
    fakeUser = makeFakeUser()
    accessToken = makeGenerateAccessToken().generate(fakeUser)
    refreshToken = await makeGenerateRefreshToken().generate(fakeUser)
  })

  const agent = request.agent(app)

  it('Should return 403 if user is logged in', async () => {
    await userCollection.insertOne(fakeUser)

    await agent
      .post('/api/v1/login/reset-password')
      .set('Cookie', `refreshToken=${refreshToken}`)
      .send()
      .expect(403)
  })

  it('Should return 401 if token is missing', async () => {
    await agent.post('/api/v1/login/reset-password').send().expect(401)
  })

  it('Should return 401 if token is invalid', async () => {
    await agent
      .post('/api/v1/login/reset-password')
      .set('Cookie', 'accessToken=invalid_token')
      .expect(401)
  })

  it('Should return 400 if params are missing', async () => {
    fakeUser.temporary.resetPasswordToken = accessToken
    await userCollection.insertOne(fakeUser)

    await agent
      .post('/api/v1/login/reset-password')
      .set('Cookie', `accessToken=${accessToken}`)
      .send()
      .expect(400)
  })

  it('Should return 400 if params are invalid', async () => {
    fakeUser.temporary.resetPasswordToken = accessToken
    await userCollection.insertOne(fakeUser)

    await agent
      .post('/api/v1/login/reset-password')
      .set('Cookie', `accessToken=${accessToken}`)
      .send({ password: '123', passwordConfirmation: '1234' })
      .expect(400)
  })

  it('Should return 200 if params are valid', async () => {
    fakeUser.temporary.resetPasswordToken = accessToken
    await userCollection.insertOne(fakeUser)

    await agent
      .post('/api/v1/login/reset-password')
      .set('Cookie', `accessToken=${accessToken}`)
      .send({ password: '123456', passwordConfirmation: '123456' })
      .expect(200)
  })
})
