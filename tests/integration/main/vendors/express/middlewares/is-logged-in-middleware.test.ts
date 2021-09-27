import { IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongo-adapter'

import { makeGenerateRefreshToken } from '@/main/factories/providers/token'
import app from '@/main/vendors/express/config/app'
import { isLoggedInMiddleware } from '@/main/vendors/express/routes'

import { makeFakeUser } from '@/tests/__mocks__'

import { Collection } from 'mongodb'
import request from 'supertest'

describe('isLoggedInMiddleware', () => {
  let fakeUser: IUser
  let refreshToken: string
  let userCollection: Collection

  afterAll(async () => {
    await MongoAdapter.disconnect()
  })

  afterEach(async () => {
    await userCollection.deleteMany({})
  })

  beforeAll(async () => {
    await MongoAdapter.connect(global.__MONGO_URI__)

    userCollection = MongoAdapter.getCollection('users')

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
