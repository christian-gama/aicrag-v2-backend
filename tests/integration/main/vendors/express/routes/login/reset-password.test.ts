import { MongoHelper } from '@/infra/database/mongodb/helper'

import { makeGenerateRefreshToken, makeGenerateAccessToken } from '@/main/factories/providers/token'
import app from '@/main/vendors/express/config/app'
import { isLoggedInMiddleware, resetPasswordController } from '@/main/vendors/express/routes'

import { makeFakeUser } from '@/tests/__mocks__'

import { Collection } from 'mongodb'
import request from 'supertest'

describe('POST /reset-password', () => {
  let userCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)

    userCollection = MongoHelper.getCollection('users')

    app.post('/api/v1/login/reset-password', isLoggedInMiddleware, resetPasswordController)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  afterEach(async () => {
    await userCollection.deleteMany({})
  })

  const agent = request.agent(app)

  it('Should return 403 if user is logged in', async () => {
    const fakeUser = makeFakeUser()
    const refreshToken = await makeGenerateRefreshToken().generate(fakeUser)
    await userCollection.insertOne(fakeUser)

    await agent.post('/api/v1/login/reset-password').set('Cookie', `refreshToken=${refreshToken}`).send().expect(403)
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
    const fakeUser = makeFakeUser()
    const resetPasswordToken = makeGenerateAccessToken().generate(fakeUser)
    fakeUser.temporary.resetPasswordToken = resetPasswordToken
    await userCollection.insertOne(fakeUser)

    await agent
      .post('/api/v1/login/reset-password')
      .set('Cookie', `accessToken=${resetPasswordToken}`)
      .send()
      .expect(400)
  })

  it('Should return 400 if params are invalid', async () => {
    const fakeUser = makeFakeUser()
    const resetPasswordToken = makeGenerateAccessToken().generate(fakeUser)
    fakeUser.temporary.resetPasswordToken = resetPasswordToken
    await userCollection.insertOne(fakeUser)

    await agent
      .post('/api/v1/login/reset-password')
      .set('Cookie', `accessToken=${resetPasswordToken}`)
      .send({ password: '123', passwordConfirmation: '1234' })
      .expect(400)
  })

  it('Should return 200 if params are valid', async () => {
    const fakeUser = makeFakeUser()
    const resetPasswordToken = makeGenerateAccessToken().generate(fakeUser)
    fakeUser.temporary.resetPasswordToken = resetPasswordToken
    await userCollection.insertOne(fakeUser)

    await agent
      .post('/api/v1/login/reset-password')
      .set('Cookie', `accessToken=${resetPasswordToken}`)
      .send({ password: '123456', passwordConfirmation: '123456' })
      .expect(200)
  })
})
