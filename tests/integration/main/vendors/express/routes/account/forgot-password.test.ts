
import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'
import app from '@/main/vendors/express/config/app'
import { forgotPasswordController } from '@/main/vendors/express/routes'
import { makeFakeUser } from '@/tests/__mocks__'

import { Collection } from 'mongodb'
import request from 'supertest'

describe('POST /forgot-password', () => {
  let userCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)

    userCollection = MongoHelper.getCollection('users')

    app.post('/api/auth/forgot-password', forgotPasswordController)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  afterEach(async () => {
    await userCollection.deleteMany({})
  })

  const agent = request.agent(app)

  it('Should return 200 if all validations succeds', async () => {
    const fakeUser = makeFakeUser()

    await userCollection.insertOne(fakeUser)

    await agent
      .post('/api/auth/forgot-password')
      .send({ email: fakeUser.personal.email })
      .expect(200)
  })

  it('Should return 400 if email does not exist', async () => {
    const fakeUser = makeFakeUser()

    await agent
      .post('/api/auth/forgot-password')
      .send({ email: fakeUser.personal.email })
      .expect(400)
  })
})
