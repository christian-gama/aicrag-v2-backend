import { IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'

import App from '@/main/express/config/app'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import { makeGenerateRefreshToken } from '@/factories/providers/token'

import { makeFakeSignUpUserCredentials, makeFakeUser } from '@/tests/__mocks__'

import { Express } from 'express'
import request from 'supertest'

describe('post /signup', () => {
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
    refreshToken = await makeGenerateRefreshToken().generate(fakeUser)
  })

  it('should return 403 if user is already logged in', async () => {
    await userCollection.insertOne(fakeUser)

    const result = await request(app).post('/api/v1/signup').set('x-refresh-token', refreshToken).send()

    expect(result.status).toBe(403)
  })

  it('should return 400 if validation fails', async () => {
    const result = await request(app).post('/api/v1/signup').send({})

    expect(result.status).toBe(400)
  })

  it('should return 409 if email already exists', async () => {
    const fakeSignUpUserCredentials = {
      email: fakeUser.personal.email,
      name: fakeUser.personal.name,
      password: fakeUser.personal.password,
      passwordConfirmation: fakeUser.personal.password
    }
    await userCollection.insertOne(fakeUser)

    const result = await request(app).post('/api/v1/signup').send(fakeSignUpUserCredentials)

    expect(result.status).toBe(409)
  })

  it('should return 400 if miss a param or param is invalid', async () => {
    const result = await request(app).post('/api/v1/signup').send()

    expect(result.status).toBe(400)
  })

  it('should return 200 if all validations succeeds', async () => {
    const result = await request(app).post('/api/v1/signup').send(makeFakeSignUpUserCredentials())

    expect(result.status).toBe(200)
  }, 12000)
})
