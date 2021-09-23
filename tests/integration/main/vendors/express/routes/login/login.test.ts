import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'
import { loginController } from '@/main/vendors/express/routes'
import app from '@/main/vendors/express/config/app'
import { makeFakeUser } from '@/tests/__mocks__/mock-user'

import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import request from 'supertest'

describe('POST /login', () => {
  let userCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)

    userCollection = MongoHelper.getCollection('users')

    app.post('/api/v1/login', loginController)
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
    const hashedPassword = await hash(fakeUser.personal.password, 12)
    const userPassword = fakeUser.personal.password
    fakeUser.personal.password = hashedPassword
    fakeUser.settings.accountActivated = true

    await userCollection.insertOne(fakeUser)

    await agent
      .post('/api/v1/login')
      .send({ email: fakeUser.personal.email, password: userPassword })
      .expect(200)
  })

  it('Should return 401 if credentials are invalid', async () => {
    await agent
      .post('/api/v1/login')
      .send({ email: 'invalid_email@email.com', password: 'invalid_password' })
      .expect(401)
  })

  it('Should return 200 if account is not activated', async () => {
    const fakeUser = makeFakeUser()
    const hashedPassword = await hash(fakeUser.personal.password, 12)
    const userPassword = fakeUser.personal.password
    fakeUser.personal.password = hashedPassword

    await userCollection.insertOne(fakeUser)

    await agent
      .post('/api/v1/login')
      .send({ email: fakeUser.personal.email, password: userPassword })
      .expect(200)
  })

  it('Should return 400 if miss a param or param is invalid', async () => {
    await agent.post('/api/v1/login').send().expect(400)
  })
})
