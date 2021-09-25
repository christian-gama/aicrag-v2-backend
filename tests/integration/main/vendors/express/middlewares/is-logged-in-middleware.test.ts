import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'

import { makeGenerateRefreshToken } from '@/main/factories/providers/token'
import app from '@/main/vendors/express/config/app'
import { isLoggedInMiddleware } from '@/main/vendors/express/routes'

import { makeFakeUser } from '@/tests/__mocks__'

import { Collection } from 'mongodb'
import request from 'supertest'

describe('IsLoggedInMiddleware', () => {
  let refreshToken: string
  let userCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)

    userCollection = MongoHelper.getCollection('users')

    const fakeUser = makeFakeUser()
    await userCollection.insertOne(fakeUser)
    refreshToken = await makeGenerateRefreshToken().generate(fakeUser)

    app.get('/is-logged-in', isLoggedInMiddleware, (req, res) => {
      if ((req as any).user) res.send('user')
      else res.send('no_user')
    })
  })

  afterAll(async () => {
    await userCollection.deleteMany({})
    await MongoHelper.disconnect()
  })

  const agent = request.agent(app)

  it('Should not return a user if fails', async () => {
    await agent.get('/is-logged-in').expect('no_user')
  })

  it('Should return a user if succeds', async () => {
    await agent.get('/is-logged-in').set('Cookie', `refreshToken=${refreshToken}`).expect('user')
  })
})
