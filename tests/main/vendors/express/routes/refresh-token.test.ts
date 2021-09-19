import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'
import { middlewareAdapter } from '@/main/vendors/express/adapters/middleware-adapter'
import app from '@/main/vendors/express/config/app'
import { makeVerifyAccessToken } from '@/main/factories/middlewares/authentication/verify-access-token'
import { makeVerifyRefreshToken } from '@/main/factories/middlewares/authentication/verify-refresh-token'
import { makeFakeUser } from '@/tests/__mocks__/domain/mock-user'

import { Collection } from 'mongodb'
import request from 'supertest'
import { makeGenerateRefreshToken } from '@/main/factories/providers/generate-refresh-token-factory'
import { makeGenerateAccessToken } from '@/main/factories/providers/generate-access-token-factory'

describe('RefreshToken middleware', () => {
  let accessToken: string
  let refreshToken: string
  let userCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)

    const verifyAccessToken = middlewareAdapter(makeVerifyAccessToken())
    const verifyRefreshToken = middlewareAdapter(makeVerifyRefreshToken())

    app.get('/invalid-refresh-token', verifyRefreshToken, (req, res) => {
      res.send()
    })

    const fakeUser = makeFakeUser()

    userCollection = await MongoHelper.getCollection('users')
    await userCollection.insertOne(fakeUser)

    accessToken = makeGenerateAccessToken().generate(fakeUser)
    refreshToken = await makeGenerateRefreshToken().generate(fakeUser)

    app.get('/save_cookie', (req, res) => {
      res.cookie('accessToken', accessToken)
      res.cookie('refreshToken', refreshToken)

      res.send()
    })

    app.get('/valid-refresh-token', verifyRefreshToken, verifyAccessToken, (req, res) => {
      res.send()
    })
  })

  afterAll(async () => {
    await userCollection.deleteMany({})

    await MongoHelper.disconnect()
  })

  const agent = request.agent(app)

  it('Should return 401 if there is an invalid refresh token', async () => {
    await agent.get('/invalid-refresh-token').expect(401)
  })

  it('Should save cookies', async () => {
    await agent
      .get('/save_cookie')
      .expect(
        'set-cookie',
        `accessToken=${accessToken}; Path=/,refreshToken=${refreshToken}; Path=/`
      )
  })

  it('Should return 200 if there is a valid refresh token', async () => {
    await agent.get('/valid-refresh-token').expect(200)
  })
})
