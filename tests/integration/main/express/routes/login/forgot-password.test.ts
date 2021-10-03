import { IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { CollectionProtocol } from '@/infra/database/protocols'

import app from '@/main/express/config/app'

import { makeFakeUser } from '@/tests/__mocks__'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import { makeGenerateRefreshToken } from '@/factories/providers/token'
import request from 'supertest'

describe('post /forgot-password', () => {
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

  it('should return 200 if all validations succeeds', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await agent
      .post('/api/v1/login/forgot-password')
      .send({ email: fakeUser.personal.email })
      .then(() => expect(200))
  })

  it('should return 400 if email does not exist', async () => {
    expect.assertions(0)

    await agent
      .post('/api/v1/login/forgot-password')
      .send({ email: fakeUser.personal.email })
      .then(() => expect(400))
  })

  it('should return 403 if user is logged in', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await agent
      .post('/api/v1/login/forgot-password')
      .set('Cookie', `refreshToken=${refreshToken}`)
      .send({ email: fakeUser.personal.email })
      .then(() => expect(403))
  })
})
