import { IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'

import App from '@/main/express/config/app'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import { makeGenerateAccessToken, makeGenerateRefreshToken } from '@/factories/providers/token'

import { makeFakeUser } from '@/tests/__mocks__'

import { Express } from 'express'
import request from 'supertest'

describe('get /verify-reset-password-token', () => {
  const client = makeMongoDb()
  let app: Express
  let dbIsConnected = true
  let fakeUser: IUser
  let refreshToken: string
  let userCollection: ICollectionMethods

  afterAll(async () => {
    if (!dbIsConnected) await client.disconnect()
  })

  beforeAll(async () => {
    dbIsConnected = MongoAdapter.client !== null
    if (!dbIsConnected) await MongoAdapter.connect(global.__MONGO_URI__)

    app = await App.setup()

    userCollection = client.collection('users')
  })

  beforeEach(async () => {
    fakeUser = makeFakeUser()
    refreshToken = await makeGenerateRefreshToken().generate(fakeUser)
  })

  it('should return 403 if user is logged in', async () => {
    await userCollection.insertOne(fakeUser)

    const result = await request(app)
      .get('/api/v1/token/verify-reset-password-token/any_token')
      .set('x-refresh-token', refreshToken)
      .send()

    expect(result.status).toBe(403)
  })

  it('should return 401 if token is invalid', async () => {
    const result = await request(app).get('/api/v1/token/verify-reset-password-token/invalid_token')

    expect(result.status).toBe(401)
  })

  it("should return 401 if param's token does not match user's token", async () => {
    const resetPasswordToken = makeGenerateAccessToken().generate(fakeUser)
    fakeUser.temporary.resetPasswordToken = resetPasswordToken
    await userCollection.insertOne(fakeUser)

    const differentResetPasswordToken = makeGenerateAccessToken().generate(makeFakeUser())

    const result = await request(app).get(`/api/v1/token/verify-reset-password-token/${differentResetPasswordToken}`)

    expect(result.status).toBe(401)
  })

  it('should return 200 if token is valid', async () => {
    const resetPasswordToken = makeGenerateAccessToken().generate(fakeUser)
    fakeUser.temporary.resetPasswordToken = resetPasswordToken
    await userCollection.insertOne(fakeUser)

    const result = await request(app).get(`/api/v1/token/verify-reset-password-token/${resetPasswordToken}`)

    expect(result.status).toBe(200)
  })
})
