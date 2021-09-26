import { IUser } from '@/domain'

import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'

import { makeGenerateRefreshToken } from '@/main/factories/providers/token'
import app from '@/main/vendors/express/config/app'

import { makeFakeUser } from '@/tests/__mocks__'

import { Collection } from 'mongodb'
import request from 'supertest'

describe('post /forgot-password', () => {
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

  it('should return 200 if all validations succeds', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await agent
      .post('/api/v1/login/forgot-password')
      .send({ email: fakeUser.personal.email })
      .expect(200)
  })

  it('should return 400 if email does not exist', async () => {
    expect.assertions(0)

    await agent
      .post('/api/v1/login/forgot-password')
      .send({ email: fakeUser.personal.email })
      .expect(400)
  })

  it('should return 403 if user is logged in', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await agent
      .post('/api/v1/login/forgot-password')
      .set('Cookie', `refreshToken=${refreshToken}`)
      .send({ email: fakeUser.personal.email })
      .expect(403)
  })
})
