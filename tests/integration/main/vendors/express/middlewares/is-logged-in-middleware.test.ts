import { IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database'
import { CollectionProtocol } from '@/infra/database/protocols'

import app from '@/main/express/config/app'
import { isLoggedInMiddleware } from '@/main/express/routes'

import { makeFakeUser } from '@/tests/__mocks__'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import { makeGenerateRefreshToken } from '@/factories/providers/token'
import request from 'supertest'

describe('isLoggedInMiddleware', () => {
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

    app.get('/is-logged-in', isLoggedInMiddleware, (req, res) => {
      if ((req as any).user) res.send('user')
      else res.send('no_user')
    })
  })

  beforeEach(async () => {
    fakeUser = makeFakeUser()
    refreshToken = await makeGenerateRefreshToken().generate(fakeUser)
  })

  const agent = request.agent(app)

  it('should not return a user if fails', async () => {
    expect.assertions(0)

    await agent.get('/is-logged-in').expect('no_user')
  })

  it('should return a user if succeds', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await agent.get('/is-logged-in').set('Cookie', `refreshToken=${refreshToken}`).expect('user')
  })
})
