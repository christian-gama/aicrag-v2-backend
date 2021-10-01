import { IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database'
import { CollectionProtocol } from '@/infra/database/protocols'

import app from '@/main/express/config/app'

import { makeFakeUser } from '@/tests/__mocks__'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import { makeGenerateAccessToken, makeGenerateRefreshToken } from '@/factories/providers/token'
import request from 'supertest'

describe('get /logout', () => {
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

  it('should return 200 if user is logged in', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await agent
      .get('/api/v1/account/logout')
      .set('Cookie', `refreshToken=${refreshToken};accessToken=${accessToken}`)
      .then(() => expect(200))
  })

  it('should return 401 if user is logged out', async () => {
    expect.assertions(0)

    await agent.get('/api/v1/account/logout').then(() => expect(401))
  })
})
