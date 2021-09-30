import { IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database'
import { CollectionProtocol } from '@/infra/database/protocols'

import app from '@/main/express/config/app'
import { isLoggedInMiddleware } from '@/main/express/routes'

import { makeFakeUser } from '@/tests/__mocks__'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import { makeGenerateRefreshToken } from '@/factories/providers/token'
import { Request } from 'express'
import request from 'supertest'

type RequestUser = Request & { user: IUser }

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

    app.get('/is-logged-in', isLoggedInMiddleware, (req: RequestUser, res) => {
      res.send(!!req.user)
    })
  })

  beforeEach(async () => {
    fakeUser = makeFakeUser()
    refreshToken = await makeGenerateRefreshToken().generate(fakeUser)
  })

  const agent = request.agent(app)

  it('should return false if user is not logged in', async () => {
    expect.assertions(0)

    await agent.get('/is-logged-in').expect('false')
  })

  it('should return true if user is logged in', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await agent.get('/is-logged-in').set('Cookie', `refreshToken=${refreshToken}`).expect('true')
  })
})
