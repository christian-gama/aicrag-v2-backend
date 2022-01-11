import { IUser } from '@/domain'
import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'
import App from '@/main/express/config/app'
import { makeMongoDb } from '@/main/factories/database/mongo-db-factory'
import { makeGenerateRefreshToken, makeGenerateAccessToken } from '@/main/factories/providers/token'
import { makeFakeUser } from '@/tests/__mocks__'
import { Express } from 'express'
import request from 'supertest'

describe('patch /reset-password', () => {
  const client = makeMongoDb()
  let app: Express
  let accessToken: string
  let dbIsConnected = true
  let fakeUser: IUser
  let refreshToken: string
  let userCollection: ICollectionMethods

  afterAll(async () => {
    if (!dbIsConnected) await client.disconnect()
  })

  afterEach(async () => {
    await userCollection.deleteMany({})
  })

  beforeAll(async () => {
    dbIsConnected = MongoAdapter.client !== null
    if (!dbIsConnected) await MongoAdapter.connect(global.__MONGO_URI__)

    app = await App.setup()

    userCollection = client.collection('users')
  })

  beforeEach(async () => {
    fakeUser = makeFakeUser()
    accessToken = makeGenerateAccessToken().generate(fakeUser)
    refreshToken = await makeGenerateRefreshToken().generate(fakeUser)
  })

  it('should return 403 if user is logged in', async () => {
    await userCollection.insertOne(fakeUser)

    const result = await request(app)
      .patch('/api/v1/login/reset-password')
      .set('x-refresh-token', refreshToken)
      .set('x-access-token', accessToken)
      .send()

    expect(result.status).toBe(403)
  })

  it('should return 401 if token is missing', async () => {
    const result = await request(app).patch('/api/v1/login/reset-password').send()

    expect(result.status).toBe(401)
  })

  it('should return 401 if token is invalid', async () => {
    const result = await request(app).patch('/api/v1/login/reset-password').set('x-access-token', 'invalid-token')

    expect(result.status).toBe(401)
  })

  it('should return 400 if params are missing', async () => {
    fakeUser.temporary.resetPasswordToken = accessToken
    await userCollection.insertOne(fakeUser)

    const result = await request(app).patch('/api/v1/login/reset-password').set('x-access-token', accessToken).send()

    expect(result.status).toBe(400)
  })

  it('should return 400 if params are invalid', async () => {
    fakeUser.temporary.resetPasswordToken = accessToken
    await userCollection.insertOne(fakeUser)

    const result = await request(app)
      .patch('/api/v1/login/reset-password')
      .set('x-access-token', accessToken)
      .send({ password: '123', passwordConfirmation: '1234' })

    expect(result.status).toBe(400)
  })

  it('should return 200 if params are valid', async () => {
    fakeUser.temporary.resetPasswordToken = accessToken
    await userCollection.insertOne(fakeUser)

    const result = await request(app)
      .patch('/api/v1/login/reset-password')
      .set('x-access-token', accessToken)
      .send({ password: '123456', passwordConfirmation: '123456' })

    expect(result.status).toBe(200)
  })
})
