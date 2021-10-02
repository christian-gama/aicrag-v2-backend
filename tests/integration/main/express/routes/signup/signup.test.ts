import { IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { CollectionProtocol } from '@/infra/database/protocols'

import app from '@/main/express/config/app'

import { makeFakeSignUpUserCredentials, makeFakeUser } from '@/tests/__mocks__'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import { makeGenerateRefreshToken } from '@/factories/providers/token'
import request from 'supertest'

describe('post /signup', () => {
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

  it('should return 403 if user is already logged in', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await agent
      .post('/api/v1/signup')
      .set('Cookie', `refreshToken=${refreshToken}`)
      .send()
      .then(() => expect(403))
  })

  it('should return 400 if validation fails', async () => {
    expect.assertions(0)

    await agent
      .post('/api/v1/signup')
      .send({})
      .then(() => expect(400))
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

    await agent
      .post('/api/v1/signup')
      .send(fakeSignUpUserCredentials)
      .then(() => expect(409))
  })

  it('should return 400 if miss a param or param is invalid', async () => {
    expect.assertions(0)

    await agent
      .post('/api/v1/signup')
      .send()
      .then(() => expect(400))
  })

  it('should return 200 if all validations succeds', async () => {
    expect.assertions(0)

    await agent
      .post('/api/v1/signup')
      .send(makeFakeSignUpUserCredentials())
      .then(() => expect(200))
  }, 12000)
})
