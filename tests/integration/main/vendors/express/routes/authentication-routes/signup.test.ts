import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'
import { signUpController } from '@/main/vendors/express/routes/.'
import app from '@/main/vendors/express/config/app'
import { makeFakeSignUpUserCredentials } from '@/tests/__mocks__/domain/mock-signup-user-credentials'
import { makeFakeUser } from '@/tests/__mocks__/domain/mock-user'

import { Collection } from 'mongodb'
import request from 'supertest'

describe('POST /signup', () => {
  let userCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)

    userCollection = await MongoHelper.getCollection('users')

    app.post('/api/auth/signup', signUpController)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  afterEach(async () => {
    await userCollection.deleteMany({})
  })

  const agent = request.agent(app)

  it('Should return 200 if all validations succeds', async () => {
    await agent.post('/api/auth/signup').send(makeFakeSignUpUserCredentials()).expect(200)
  })

  it('Should return 400 if validation fails', async () => {
    await agent.post('/api/auth/signup').send({}).expect(400)
  })

  it('Should return 409 if email already exists', async () => {
    const fakeUser = makeFakeUser()
    const fakeSignUpUserCredentials = {
      name: fakeUser.personal.name,
      email: fakeUser.personal.email,
      password: fakeUser.personal.password,
      passwordConfirmation: fakeUser.personal.password
    }
    await userCollection.insertOne(fakeUser)

    await agent.post('/api/auth/signup').send(fakeSignUpUserCredentials).expect(409)
  })

  it('Should return 400 if miss a param or param is invalid', async () => {
    await agent.post('/api/auth/signup').send().expect(400)
  })
})
