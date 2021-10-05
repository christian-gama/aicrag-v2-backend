import { IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { CollectionProtocol } from '@/infra/database/protocols'

import app from '@/main/express/config/app'
import { partialProtectedMiddleware } from '@/main/express/routes'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import { makeGenerateAccessToken } from '@/factories/providers/token'

import { makeFakeUser } from '@/tests/__mocks__'

import request from 'supertest'

describe('partialProtectedMiddleware', () => {
  const client = makeMongoDb()
  let accessToken: string
  let fakeUser: IUser
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

    app.get('/partial-protected', partialProtectedMiddleware, (req, res) => {
      res.send()
    })
  })

  beforeEach(async () => {
    fakeUser = makeFakeUser()
    accessToken = makeGenerateAccessToken().generate(fakeUser)
  })

  it('should return 401 if fails', async () => {
    expect.assertions(0)

    await request(app).get('/partial-protected').expect(401)
  })

  it('should return 200 if succeeds', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await request(app).get('/partial-protected').set('Cookie', `accessToken=${accessToken}`).expect(200)
  })
})
