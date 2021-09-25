import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'

import { makeGenerateRefreshToken } from '@/main/factories/providers/token'
import app from '@/main/vendors/express/config/app'

import { makeFakeUser } from '@/tests/__mocks__'

import { Collection } from 'mongodb'
import request from 'supertest'

describe('POST /forgot-password', () => {
  let userCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)

    userCollection = MongoHelper.getCollection('users')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  afterEach(async () => {
    await userCollection.deleteMany({})
  })

  const agent = request.agent(app)

  it('Should return 200 if all validations succeds', async () => {
    const fakeUser = makeFakeUser()

    await userCollection.insertOne(fakeUser)

    await agent
      .post('/api/v1/login/forgot-password')
      .send({ email: fakeUser.personal.email })
      .expect(200)
  })

  it('Should return 400 if email does not exist', async () => {
    const fakeUser = makeFakeUser()

    await agent
      .post('/api/v1/login/forgot-password')
      .send({ email: fakeUser.personal.email })
      .expect(400)
  })

  it('Should return 403 if user is logged in', async () => {
    const fakeUser = makeFakeUser()
    const refreshToken = await makeGenerateRefreshToken().generate(fakeUser)
    await userCollection.insertOne(fakeUser)

    await agent
      .post('/api/v1/login/forgot-password')
      .set('Cookie', `refreshToken=${refreshToken}`)
      .send({ email: fakeUser.personal.email })
      .expect(403)
  })
})
