import { MongoHelper } from '@/infra/database/mongodb/helper'
import { makeGenerateAccessToken } from '@/main/factories/providers/token'
import app from '@/main/vendors/express/config/app'
import { verifyResetPasswordTokenController } from '@/main/vendors/express/routes'
import { makeFakeUser } from '@/tests/__mocks__'

import { Collection } from 'mongodb'
import request from 'supertest'

describe('GET /verify-reset-password-token', () => {
  let userCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)

    userCollection = MongoHelper.getCollection('users')

    app.get('/api/v1/token/verify-reset-password-token/:token', verifyResetPasswordTokenController)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  afterEach(async () => {
    await userCollection.deleteMany({})
  })

  const agent = request.agent(app)

  it('Should return 200 if token is valid', async () => {
    const fakeUser = makeFakeUser()
    const resetPasswordToken = makeGenerateAccessToken().generate(fakeUser)
    fakeUser.temporary.resetPasswordToken = resetPasswordToken
    await userCollection.insertOne(fakeUser)

    await agent.get(`/api/v1/token/verify-reset-password-token/${resetPasswordToken}`).expect(200)
  }, 12000)

  it('Should return 401 if token is invalid', async () => {
    await agent.get('/api/v1/token/verify-reset-password-token/invalid_token').expect(401)
  })

  it("Should return 401 if param's token does not match user's token", async () => {
    const fakeUser = makeFakeUser()
    const resetPasswordToken = makeGenerateAccessToken().generate(fakeUser)
    fakeUser.temporary.resetPasswordToken = resetPasswordToken
    await userCollection.insertOne(fakeUser)

    const differentResetPasswordToken = makeGenerateAccessToken().generate(makeFakeUser())

    await agent.get(`/api/v1/token/verify-reset-password-token/${differentResetPasswordToken}`).expect(401)
  })
})
