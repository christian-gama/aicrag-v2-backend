import { IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database'
import { CollectionProtocol } from '@/infra/database/protocols'

import app from '@/main/express/config/app'
import { protectedMiddleware } from '@/main/express/routes'

import { makeFakeUser } from '@/tests/__mocks__'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import { makeGenerateAccessToken, makeGenerateRefreshToken } from '@/factories/providers/token'
import request from 'supertest'

describe('protectedMiddleware', () => {
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

    app.get('/protected', protectedMiddleware, (req, res) => {
      res.send()
    })
  })

  beforeEach(async () => {
    fakeUser = makeFakeUser()
    refreshToken = await makeGenerateRefreshToken().generate(fakeUser)
    accessToken = makeGenerateAccessToken().generate(fakeUser)
  })

  const agent = request.agent(app)

  it('should return 401 if refresh token is invalid', async () => {
    expect.assertions(0)

    await agent.get('/protected').then(() => expect(401))
  })

  it('should return 401 if access token is invalid', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await agent
      .get('/protected')
      .set('Cookie', `refreshToken=${refreshToken};accessToken=invalid_token`)
      .then(() => expect(401))
  })

  it('should return 200 if refresh token and access token are valid', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await agent
      .get('/protected')
      .set('Cookie', `refreshToken=${refreshToken};accessToken=${accessToken}`)
      .then(() => expect(200))
  })
})
