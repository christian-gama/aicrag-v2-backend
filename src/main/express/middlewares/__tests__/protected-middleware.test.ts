import { IUser } from '@/domain'
import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'
import App from '@/main/express/config/app'
import { protectedMiddleware } from '@/main/express/routes'
import { makeMongoDb } from '@/main/factories/database/mongo-db-factory'
import { makeGenerateAccessToken, makeGenerateRefreshToken } from '@/main/factories/providers/token'
import { makeFakeUser } from '@/tests/__mocks__'
import { Express } from 'express'
import request from 'supertest'

describe('protectedMiddleware', () => {
  const client = makeMongoDb()
  let accessToken: string
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

    app.get('/protected', protectedMiddleware, (req, res) => {
      res.send()
    })
  })

  beforeEach(async () => {
    fakeUser = makeFakeUser()
    accessToken = makeGenerateAccessToken().generate(fakeUser)
    refreshToken = await makeGenerateRefreshToken().generate(fakeUser)
  })

  it('should return 401 if refresh token is invalid', async () => {
    const result = await request(app).get('/protected')

    expect(result.status).toBe(401)
  })

  it('should return 401 if access token is invalid', async () => {
    await userCollection.insertOne(fakeUser)

    const result = await request(app)
      .get('/protected')
      .set('x-access-token', 'invalid-token')
      .set('x-refresh-token', refreshToken)

    expect(result.status).toBe(401)
  })

  it('should return 200 if refresh token and access token are valid', async () => {
    await userCollection.insertOne(fakeUser)

    const result = await request(app)
      .get('/protected')
      .set('x-access-token', accessToken)
      .set('x-refresh-token', refreshToken)

    expect(result.status).toBe(200)
  })
})
