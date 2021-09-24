import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'

import { makeGenerateRefreshToken } from '@/main/factories/providers/token'
import app from '@/main/vendors/express/config/app'
import { isLoggedInMiddleware, loginController } from '@/main/vendors/express/routes'

import { makeFakeUser } from '@/tests/__mocks__/mock-user'

import { hash } from 'bcrypt'
import { Collection } from 'mongodb'
import request from 'supertest'

describe('POST /login', () => {
  let userCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)

    userCollection = MongoHelper.getCollection('users')

    app.post('/api/v1/login', isLoggedInMiddleware, loginController)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  afterEach(async () => {
    await userCollection.deleteMany({})
  })

  const agent = request.agent(app)

  it('Should return 403 if user is logged in', async () => {
    const fakeUser = makeFakeUser()
    await userCollection.insertOne(fakeUser)
    const refreshToken = await makeGenerateRefreshToken().generate(fakeUser)

    await agent
      .post('/api/v1/login')
      .set('Cookie', `refreshToken=${refreshToken}`)
      .send()
      .expect(403)
  })

  it('Should return 401 if credentials are invalid', async () => {
    await agent
      .post('/api/v1/login')
      .send({ email: 'invalid_email@email.com', password: 'invalid_password' })
      .expect(401)
  })

  it('Should return 400 if miss a param or param is invalid', async () => {
    await agent.post('/api/v1/login').send().expect(400)
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
})
