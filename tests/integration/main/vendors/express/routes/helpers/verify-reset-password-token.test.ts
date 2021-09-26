import { IUser } from '@/domain'

import { MongoHelper } from '@/infra/database/mongodb/helper'

import { makeGenerateAccessToken, makeGenerateRefreshToken } from '@/main/factories/providers/token'
import app from '@/main/vendors/express/config/app'

import { makeFakeUser } from '@/tests/__mocks__'

import { Collection } from 'mongodb'
import request from 'supertest'

describe('GET /verify-reset-password-token', () => {
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

  it('Should return 403 if user is logged in', async () => {
    await userCollection.insertOne(fakeUser)

    await agent
      .get('/api/v1/helpers/verify-reset-password-token/any_token')
      .set('Cookie', `refreshToken=${refreshToken}`)
      .send()
      .expect(403)
  })

  it('Should return 401 if token is invalid', async () => {
    await agent.get('/api/v1/helpers/verify-reset-password-token/invalid_token').expect(401)
  })

  it("Should return 401 if param's token does not match user's token", async () => {
    const resetPasswordToken = makeGenerateAccessToken().generate(fakeUser)
    fakeUser.temporary.resetPasswordToken = resetPasswordToken
    await userCollection.insertOne(fakeUser)

    const differentResetPasswordToken = makeGenerateAccessToken().generate(makeFakeUser())

    await agent
      .get(`/api/v1/helpers/verify-reset-password-token/${differentResetPasswordToken}`)
      .expect(401)
  })

  it('Should return 200 if token is valid', async () => {
    const resetPasswordToken = makeGenerateAccessToken().generate(fakeUser)
    fakeUser.temporary.resetPasswordToken = resetPasswordToken
    await userCollection.insertOne(fakeUser)

    await agent.get(`/api/v1/helpers/verify-reset-password-token/${resetPasswordToken}`).expect(200)
  })
})
