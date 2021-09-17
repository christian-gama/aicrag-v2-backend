import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'
import { middlewareAdapter } from '@/main/vendors/express/adapters/middleware-adapter'
import app from '@/main/vendors/express/config/app'
import { makeJwtRefreshToken } from '@/main/factories/cryptography/jwt-refresh-token-factory'
import { makeRefreshTokenMiddleware } from '@/main/factories/middlewares/authentication/refresh-token-middleware-factory'
import { makeRefreshTokenDbRepository } from '@/main/factories/repositories/refresh-token/refresh-token-db-repository/refresh-token-db-repository-factory'
import { makeFakeUser } from '@/tests/__mocks__/domain/mock-user'

import { Collection } from 'mongodb'
import request from 'supertest'

describe('RefreshToken middleware', () => {
  let refreshTokenCollection: Collection
  let userCollection: Collection
  let encryptedRefreshToken: string = ''

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)

    const refreshTokenMiddleware = middlewareAdapter(makeRefreshTokenMiddleware())

    app.get('/invalid-refresh-token', refreshTokenMiddleware, (req, res) => {
      res.send()
    })

    const fakeUser = makeFakeUser()
    const refreshToken = await makeRefreshTokenDbRepository().saveRefreshToken(fakeUser.personal.id)
    encryptedRefreshToken = makeJwtRefreshToken().encrypt('id', refreshToken.id)

    userCollection = await MongoHelper.getCollection('users')
    fakeUser.temporary.refreshToken = refreshToken.id
    await userCollection.insertOne(fakeUser)

    app.get('/save_cookie', (req, res) => {
      res.cookie('refreshToken', encryptedRefreshToken)

      res.send()
    })

    app.get('/valid-refresh-token', refreshTokenMiddleware, (req, res) => {
      res.send()
    })
  })

  afterAll(async () => {
    refreshTokenCollection = await MongoHelper.getCollection('refresh_tokens')
    await refreshTokenCollection.deleteMany({})
    await userCollection.deleteMany({})

    await MongoHelper.disconnect()
  })

  const agent = request.agent(app)

  it('Should return 401 if there is no refresh token', async () => {
    await agent.get('/invalid-refresh-token').expect(401)
  })

  it('Should save cookies', async () => {
    await agent
      .get('/save_cookie')
      .expect('set-cookie', `refreshToken=${encryptedRefreshToken}; Path=/`)
  })

  it('Should return 200 if there is a refresh token', async () => {
    await agent.get('/valid-refresh-token').expect(200)
  })
})
