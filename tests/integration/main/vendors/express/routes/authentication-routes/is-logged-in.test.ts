import { IUser } from '@/domain/user'
import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'
import app from '@/main/vendors/express/config/app'
import { makeGenerateRefreshToken } from '@/main/factories/providers/token/generate-refresh-token-factory'
import { makeFakeUser } from '@/tests/__mocks__/domain/mock-user'
import { isLoggedInMiddleware } from '@/main/vendors/express/routes/.'

import { Collection } from 'mongodb'
import request from 'supertest'
import { Request } from 'express'

type RequestUser = Request & { user: IUser }

describe('IsLoggedInMiddleware', () => {
  let refreshToken: string
  let userCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)

    app.get('/is-logged-out', isLoggedInMiddleware, (req: RequestUser, res) => {
      res.send(!!req.user)
    })

    const fakeUser = makeFakeUser()

    userCollection = MongoHelper.getCollection('users')
    await userCollection.insertOne(fakeUser)

    refreshToken = await makeGenerateRefreshToken().generate(fakeUser)

    app.get('/is-logged-in', isLoggedInMiddleware, (req: RequestUser, res) => {
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

  it('Should return true if user is logged in', async () => {
    await agent.get('/is-logged-in').set('Cookie', `refreshToken=${refreshToken}`).expect('true')
  })
})
