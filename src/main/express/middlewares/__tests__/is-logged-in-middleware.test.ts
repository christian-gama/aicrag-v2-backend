import { IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'

import App from '@/main/express/config/app'
import { isLoggedInMiddleware } from '@/main/express/routes'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import { makeGenerateRefreshToken } from '@/factories/providers/token'

import { makeFakeUser } from '@/tests/__mocks__'

import { Express } from 'express'
import request from 'supertest'

describe('isLoggedInMiddleware', () => {
  const client = makeMongoDb()
  let app: Express
  let dbIsConnected = true
  let fakeUser: IUser
  let refreshToken: string
  let userCollection: ICollectionMethods

  afterAll(async () => {
    if (!dbIsConnected) await client.disconnect()
  })

  beforeAll(async () => {
    dbIsConnected = MongoAdapter.client !== null
    if (!dbIsConnected) await MongoAdapter.connect(global.__MONGO_URI__)

    app = await App.setup()

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
    const result = await request(app).get('/is-logged-in')

    expect(result.text).toBe('no_user')
  })

  it('should return a user if succeeds', async () => {
    await userCollection.insertOne(fakeUser)

    const result = await request(app).get('/is-logged-in').set('x-refresh-token', refreshToken)

    expect(result.text).toBe('user')
  })
})
