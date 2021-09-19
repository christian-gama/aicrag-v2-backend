import { IUser } from '@/domain/user'
import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'
import app from '@/main/vendors/express/config/app'
import { makeGenerateRefreshToken } from '@/main/factories/providers/token/generate-refresh-token-factory'
import { makeGenerateAccessToken } from '@/main/factories/providers/token/generate-access-token-factory'
import { makeVerifyRefreshToken } from '@/main/factories/providers/token/verify-refresh-token-factory'
import { isLoggedInMiddlewareAdapter } from '@/main/vendors/express/adapters/is-logged-in-middleware-adapter'
import { makeFakeUser } from '@/tests/__mocks__/domain/mock-user'

import { Collection } from 'mongodb'
import request from 'supertest'
import { Request } from 'express'

type RequestUser = Request & { user: IUser }

describe('RefreshToken middleware', () => {
  let accessToken: string
  let refreshToken: string
  let userCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)

    const isLoggedIn = isLoggedInMiddlewareAdapter(makeVerifyRefreshToken())

    app.get('/is-logged-out', isLoggedIn, (req: RequestUser, res) => {
      res.send(!!req.user)
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

    app.get('/is-logged-in', isLoggedIn, (req: RequestUser, res) => {
      res.send(!!req.user)
    })
  })

  afterAll(async () => {
    await userCollection.deleteMany({})

    await MongoHelper.disconnect()
  })

  const agent = request.agent(app)

  it('Should return false if user is not logged in', async () => {
    await agent.get('/is-logged-out').expect('false')
  })

  it('Should save cookies', async () => {
    await agent
      .get('/save_cookie')
      .expect(
        'set-cookie',
        `accessToken=${accessToken}; Path=/,refreshToken=${refreshToken}; Path=/`
      )
  })

  it('Should return true if user is logged in', async () => {
    await agent.get('/is-logged-in').expect('true')
  })
})
