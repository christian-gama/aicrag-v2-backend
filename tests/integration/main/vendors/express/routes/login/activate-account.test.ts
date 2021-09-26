import { IUser } from '@/domain'

import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'

import { makeGenerateAccessToken } from '@/main/factories/providers/token'
import app from '@/main/vendors/express/config/app'

import { makeFakeUser } from '@/tests/__mocks__'

import { Collection } from 'mongodb'
import request from 'supertest'

describe('POST /activate-account', () => {
  let accessToken: string
  let fakeUser: IUser
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
    accessToken = makeGenerateAccessToken().generate(fakeUser)
  })

  const agent = request.agent(app)

  it('Should return 200 if all validations succeds', async () => {
    const activationCode = fakeUser.temporary.activationCode
    fakeUser.settings.accountActivated = false
    await userCollection.insertOne(fakeUser)

    await agent
      .post('/api/v1/login/activate-account')
      .set('Cookie', `accessToken=${accessToken}`)
      .send({ activationCode: activationCode, email: fakeUser.personal.email })
      .expect(200)
  })

  it('Should return 401 if user does not have access token', async () => {
    await userCollection.insertOne(fakeUser)

    await agent.post('/api/v1/login/activate-account').send().expect(401)
  })

  it('Should return 400 if code is invalid', async () => {
    await userCollection.insertOne(fakeUser)

    await agent
      .post('/api/v1/login/activate-account')
      .set('Cookie', `accessToken=${accessToken}`)
      .send({ email: fakeUser.personal.email, activationCode: 'invalid_code' })
      .expect(400)
  })

  it('Should return 400 if code is expired', async () => {
    const activationCode = fakeUser.temporary.activationCode
    fakeUser.temporary.activationCodeExpiration = new Date(Date.now() - 1000)
    await userCollection.insertOne(fakeUser)

    await agent
      .post('/api/v1/login/activate-account')
      .set('Cookie', `accessToken=${accessToken}`)
      .send({ activationCode: activationCode, email: fakeUser.personal.email })
      .expect(400)
  })

  it('Should return 400 if misses any field', async () => {
    await userCollection.insertOne(fakeUser)

    await agent
      .post('/api/v1/login/activate-account')
      .set('Cookie', `accessToken=${accessToken}`)
      .send()
      .expect(400)
  })

  it('Should return 400 if account is already activated', async () => {
    const activationCode = fakeUser.temporary.activationCode
    fakeUser.settings.accountActivated = true
    await userCollection.insertOne(fakeUser)

    await agent
      .post('/api/v1/login/activate-account')
      .set('Cookie', `accessToken=${accessToken}`)
      .send({ activationCode: activationCode, email: fakeUser.personal.email })
      .expect(400)
  })
})
