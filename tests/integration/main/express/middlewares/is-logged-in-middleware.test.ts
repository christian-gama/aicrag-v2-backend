import { IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'

import { setupApp } from '@/main/express/config/app'
import { isLoggedInMiddleware } from '@/main/express/routes'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import { makeGenerateRefreshToken } from '@/factories/providers/token'

import { makeFakeUser } from '@/tests/__mocks__'

import { Express } from 'express'
import request from 'supertest'

let app: Express

describe('isLoggedInMiddleware', () => {
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

    app.get('/is-logged-in', isLoggedInMiddleware, (req, res) => {
      if ((req as any).user) res.send('user')
      else res.send('no_user')
    })
  })

  beforeEach(async () => {
    fakeUser = makeFakeUser()
    refreshToken = await makeGenerateRefreshToken().generate(fakeUser)
  })

  it('should not return a user if fails', async () => {
    expect.assertions(0)

    await request(app).get('/is-logged-in').expect('no_user')
  })

  it('should return a user if succeeds', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await request(app).get('/is-logged-in').set('Cookie', `refreshToken=${refreshToken}`).expect('user')
  })
})
