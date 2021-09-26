import { IUser } from '@/domain'

import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'

import { makeGenerateRefreshToken } from '@/main/factories/providers/token'
import app from '@/main/vendors/express/config/app'
import { isLoggedInMiddleware } from '@/main/vendors/express/routes'

import { makeFakeUser } from '@/tests/__mocks__'

import { Request } from 'express'
import { Collection } from 'mongodb'
import request from 'supertest'

type RequestUser = Request & { user: IUser }

describe('IsLoggedInMiddleware', () => {
  let fakeUser: IUser
  let refreshToken: string
  let userCollection: Collection

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  afterEach(async () => {
    await userCollection.deleteMany({})
  })

  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)

    userCollection = MongoHelper.getCollection('users')

    app.get('/is-logged-in', isLoggedInMiddleware, (req: RequestUser, res) => {
      res.send(!!req.user)
    })
  })

  beforeEach(async () => {
    fakeUser = makeFakeUser()
    refreshToken = await makeGenerateRefreshToken().generate(fakeUser)
  })

  const agent = request.agent(app)

  it('Should return false if user is not logged in', async () => {
    await agent.get('/is-logged-in').expect('false')
  })

  it('Should return true if user is logged in', async () => {
    await userCollection.insertOne(fakeUser)

    await agent.get('/is-logged-in').set('Cookie', `refreshToken=${refreshToken}`).expect('true')
  })
})
