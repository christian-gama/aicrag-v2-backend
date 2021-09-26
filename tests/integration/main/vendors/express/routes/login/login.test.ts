import { IUser } from '@/domain'

import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'

import { makeGenerateRefreshToken } from '@/main/factories/providers/token'
import app from '@/main/vendors/express/config/app'

import { makeFakeUser } from '@/tests/__mocks__/mock-user'

import { hash } from 'bcrypt'
import { Collection } from 'mongodb'
import request from 'supertest'

describe('post /login', () => {
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
  })

  beforeEach(async () => {
    fakeUser = makeFakeUser()
    refreshToken = await makeGenerateRefreshToken().generate(fakeUser)
  })

  const agent = request.agent(app)

  it('should return 403 if user is logged in', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await agent
      .post('/api/v1/login')
      .set('Cookie', `refreshToken=${refreshToken}`)
      .send()
      .expect(403)
  })

  it('should return 401 if credentials are invalid', async () => {
    expect.assertions(0)

    await agent
      .post('/api/v1/login')
      .send({ email: 'invalid_email@email.com', password: 'invalid_password' })
      .expect(401)
  })

  it('should return 400 if miss a param or param is invalid', async () => {
    expect.assertions(0)

    await agent.post('/api/v1/login').send().expect(400)
  })

  it('should return 200 if account is not activated', async () => {
    expect.assertions(0)

    const hashedPassword = await hash(fakeUser.personal.password, 2)
    const userPassword = fakeUser.personal.password
    fakeUser.personal.password = hashedPassword
    await userCollection.insertOne(fakeUser)

    await agent
      .post('/api/v1/login')
      .send({ email: fakeUser.personal.email, password: userPassword })
      .expect(200)
  })

  it('should return 200 if all validations succeds', async () => {
    expect.assertions(0)

    const hashedPassword = await hash(fakeUser.personal.password, 2)
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
