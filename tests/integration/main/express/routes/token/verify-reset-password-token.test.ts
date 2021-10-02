import { IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { CollectionProtocol } from '@/infra/database/protocols'

import app from '@/main/express/config/app'

import { makeFakeUser } from '@/tests/__mocks__'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import { makeGenerateAccessToken, makeGenerateRefreshToken } from '@/factories/providers/token'
import request from 'supertest'

describe('get /verify-reset-password-token', () => {
  const client = makeMongoDb()
  let fakeUser: IUser
  let refreshToken: string
  let userCollection: CollectionProtocol

  afterAll(async () => {
    await client.disconnect()
  })

  afterEach(async () => {
    await userCollection.deleteMany({})
  })

  beforeAll(async () => {
    await MongoAdapter.connect(global.__MONGO_URI__)

    userCollection = client.collection('users')
  })

  beforeEach(async () => {
    fakeUser = makeFakeUser()
    refreshToken = await makeGenerateRefreshToken().generate(fakeUser)
  })

  const agent = request.agent(app)

  it('should return 403 if user is logged in', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await agent
      .get('/api/v1/token/verify-reset-password-token/any_token')
      .set('Cookie', `refreshToken=${refreshToken}`)
      .send()
      .then(() => expect(403))
  })

  it('should return 401 if token is invalid', async () => {
    expect.assertions(0)

    await agent
      .get('/api/v1/token/verify-reset-password-token/invalid_token')
      .then(() => expect(401))
  })

  it("should return 401 if param's token does not match user's token", async () => {
    expect.assertions(0)

    const resetPasswordToken = makeGenerateAccessToken().generate(fakeUser)
    fakeUser.temporary.resetPasswordToken = resetPasswordToken
    await userCollection.insertOne(fakeUser)

    const differentResetPasswordToken = makeGenerateAccessToken().generate(makeFakeUser())

    await agent
      .get(`/api/v1/token/verify-reset-password-token/${differentResetPasswordToken}`)
      .then(() => expect(401))
  })

  it('should return 200 if token is valid', async () => {
    expect.assertions(0)

    const resetPasswordToken = makeGenerateAccessToken().generate(fakeUser)
    fakeUser.temporary.resetPasswordToken = resetPasswordToken
    await userCollection.insertOne(fakeUser)

    await agent
      .get(`/api/v1/token/verify-reset-password-token/${resetPasswordToken}`)
      .then(() => expect(200))
  })
})
