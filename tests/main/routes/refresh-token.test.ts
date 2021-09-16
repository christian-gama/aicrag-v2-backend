import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'
import { adaptMiddlewares } from '@/main/adapters/express/adapt-middlewares'
import app from '@/main/config/app'
import { makeRefreshTokenMiddleware } from '@/main/factories/middlewares/authentication/refresh-token-middleware-factory'

import { Collection } from 'mongodb'
import request from 'supertest'

describe('RefreshToken middleware', () => {
  let refreshTokenCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)

    const refreshTokenMiddleware = adaptMiddlewares(makeRefreshTokenMiddleware())

    app.get('/invalid-refresh-token', refreshTokenMiddleware, (req, res) => {
      res.send()
    })
  })

  afterAll(async () => {
    refreshTokenCollection = await MongoHelper.getCollection('refresh_tokens')
    await refreshTokenCollection.deleteMany({})

    await MongoHelper.disconnect()
  })

  const agent = request.agent(app)

  it('Should return 401 if there is no refresh token', async () => {
    await agent.get('/invalid-refresh-token').expect(401)
  })
})
