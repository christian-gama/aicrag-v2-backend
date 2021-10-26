import { IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'

import { setupApp } from '@/main/express/config/app'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import { makeGenerateRefreshToken } from '@/factories/providers/token'

import { makeFakeSignUpUserCredentials, makeFakeUser } from '@/tests/__mocks__'

import { Express } from 'express'
import request from 'supertest'

let app: Express

describe('post /signup', () => {
  const client = makeMongoDb()
  let fakeUser: IUser
  let refreshToken: string
  let userCollection: ICollectionMethods

  afterAll(async () => {
    await client.disconnect()
  })

  afterEach(async () => {
    await userCollection.deleteMany({})
  })

  beforeAll(async () => {
    app = await setupApp()

    await MongoAdapter.connect(global.__MONGO_URI__)

    userCollection = client.collection('users')
  })

  beforeEach(async () => {
    fakeUser = makeFakeUser()
    refreshToken = await makeGenerateRefreshToken().generate(fakeUser)
  })

  it('should return 403 if user is already logged in', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await request(app).post('/api/v1/signup').set('x-refresh-token', refreshToken).send().expect(403)
  })

  it('should return 400 if validation fails', async () => {
    expect.assertions(0)

    await request(app).post('/api/v1/signup').send({}).expect(400)
  })

  it('should return 409 if email already exists', async () => {
    expect.assertions(0)

    const fakeSignUpUserCredentials = {
      email: fakeUser.personal.email,
      name: fakeUser.personal.name,
      password: fakeUser.personal.password,
      passwordConfirmation: fakeUser.personal.password
    }
    await userCollection.insertOne(fakeUser)

    await request(app).post('/api/v1/signup').send(fakeSignUpUserCredentials).expect(409)
  })

  it('should return 400 if miss a param or param is invalid', async () => {
    expect.assertions(0)

    await request(app).post('/api/v1/signup').send().expect(400)
  })

  it('should return 200 if all validations succeeds', async () => {
    expect.assertions(0)

    await request(app).post('/api/v1/signup').send(makeFakeSignUpUserCredentials()).expect(200)
  }, 12000)
})
