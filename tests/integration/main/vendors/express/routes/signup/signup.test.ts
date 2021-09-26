import { IUser } from '@/domain'

import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'

import { makeGenerateRefreshToken } from '@/main/factories/providers/token'
import app from '@/main/vendors/express/config/app'

import { makeFakeSignUpUserCredentials, makeFakeUser } from '@/tests/__mocks__'

import { Collection } from 'mongodb'
import request from 'supertest'

describe('post /signup', () => {
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

  it('should return 403 if user is already logged in', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await agent
      .post('/api/v1/signup')
      .set('Cookie', `refreshToken=${refreshToken}`)
      .send()
      .expect(403)
  })

  it('should return 400 if validation fails', async () => {
    expect.assertions(0)

    await agent.post('/api/v1/signup').send({}).expect(400)
  })

  it('should return 409 if email already exists', async () => {
    expect.assertions(0)

    const fakeSignUpUserCredentials = {
      email: fakeUser.personal.email,
      name: fakeUser.personal.name,
      password: fakeUser.personal.password,
      passwordConfirmation: fakeUser.personal.password
    }
    await userCollection.insertOne(fakeUser)

    await agent.post('/api/v1/signup').send(fakeSignUpUserCredentials).expect(409)
  })

  it('should return 400 if miss a param or param is invalid', async () => {
    expect.assertions(0)

    await agent.post('/api/v1/signup').send().expect(400)
  })

  it('should return 200 if all validations succeds', async () => {
    expect.assertions(0)

    await agent.post('/api/v1/signup').send(makeFakeSignUpUserCredentials()).expect(200)
  }, 12000)
})
