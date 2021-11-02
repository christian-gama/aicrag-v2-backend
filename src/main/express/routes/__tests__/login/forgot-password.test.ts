import { IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'

import App from '@/main/express/config/app'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import { makeGenerateRefreshToken } from '@/factories/providers/token'

import { makeFakeUser } from '@/tests/__mocks__'

import { Express } from 'express'
import request from 'supertest'

describe('post /forgot-password', () => {
  const client = makeMongoDb()
  let app: Express
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
    fakeUser.temporary.resetPasswordToken = 'any_token'
    refreshToken = await makeGenerateRefreshToken().generate(fakeUser)
  })

  it('should return 200 if all validations succeeds', async () => {
    await userCollection.insertOne(fakeUser)

    const result = await request(app).post('/api/v1/login/forgot-password').send({ email: fakeUser.personal.email })

    expect(result.status).toBe(200)
  })

  it('should return 400 if email does not exist', async () => {
    const result = await request(app).post('/api/v1/login/forgot-password').send({ email: fakeUser.personal.email })

    expect(result.status).toBe(400)
  })

  it('should return 400 if there is no resetPasswordToken', async () => {
    fakeUser.temporary.resetPasswordToken = null

    const result = await request(app).post('/api/v1/login/forgot-password').send({ email: fakeUser.personal.email })

    expect(result.status).toBe(400)
  })

  it('should return 403 if user is logged in', async () => {
    await userCollection.insertOne(fakeUser)

    const result = await request(app)
      .post('/api/v1/login/forgot-password')
      .set('x-refresh-token', refreshToken)
      .send({ email: fakeUser.personal.email })

    expect(result.status).toBe(403)
  })
})
