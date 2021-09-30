import { IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database'
import { CollectionProtocol } from '@/infra/database/protocols'

import app from '@/main/express/config/app'

import { makeFakeUser } from '@/tests/__mocks__'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import { makeGenerateRefreshToken, makeGenerateAccessToken } from '@/factories/providers/token'
import request from 'supertest'

describe('post /reset-password', () => {
  const client = makeMongoDb()
  let accessToken: string
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
    accessToken = makeGenerateAccessToken().generate(fakeUser)
    refreshToken = await makeGenerateRefreshToken().generate(fakeUser)
  })

  const agent = request.agent(app)

  it('should return 403 if user is logged in', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await agent
      .post('/api/v1/login/reset-password')
      .set('Cookie', `refreshToken=${refreshToken}`)
      .send()
      .expect(403)
  })

  it('should return 401 if token is missing', async () => {
    expect.assertions(0)

    await agent.post('/api/v1/login/reset-password').send().expect(401)
  })

  it('should return 401 if token is invalid', async () => {
    expect.assertions(0)

    await agent
      .post('/api/v1/login/reset-password')
      .set('Cookie', 'accessToken=invalid_token')
      .expect(401)
  })

  it('should return 400 if params are missing', async () => {
    expect.assertions(0)

    fakeUser.temporary.resetPasswordToken = accessToken
    await userCollection.insertOne(fakeUser)

    await agent
      .post('/api/v1/login/reset-password')
      .set('Cookie', `accessToken=${accessToken}`)
      .send()
      .expect(400)
  })

  it('should return 400 if params are invalid', async () => {
    expect.assertions(0)

    fakeUser.temporary.resetPasswordToken = accessToken
    await userCollection.insertOne(fakeUser)

    await agent
      .post('/api/v1/login/reset-password')
      .set('Cookie', `accessToken=${accessToken}`)
      .send({ password: '123', passwordConfirmation: '1234' })
      .expect(400)
  })

  it('should return 200 if params are valid', async () => {
    expect.assertions(0)

    fakeUser.temporary.resetPasswordToken = accessToken
    await userCollection.insertOne(fakeUser)

    await agent
      .post('/api/v1/login/reset-password')
      .set('Cookie', `accessToken=${accessToken}`)
      .send({ password: '123456', passwordConfirmation: '123456' })
      .expect(200)
  })
})
