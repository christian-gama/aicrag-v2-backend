import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'

import { makeGenerateAccessToken } from '@/main/factories/providers/token'
import app from '@/main/vendors/express/config/app'

import { makeFakeUser } from '@/tests/__mocks__'

import { Collection } from 'mongodb'
import request from 'supertest'

describe('POST /activate-account', () => {
  let userCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)

    userCollection = MongoHelper.getCollection('users')
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
    const accessToken = makeGenerateAccessToken().generate(fakeUser)
    const activationCode = fakeUser.temporary.activationCode
    fakeUser.settings.accountActivated = false

    await agent
      .post('/api/v1/login/activate-account')
      .set('Cookie', `accessToken=${accessToken}`)
      .send({ activationCode: activationCode, email: fakeUser.personal.email })
      .expect(200)
  })

  it('Should return 401 if user does not have access token', async () => {
    const fakeUser = makeFakeUser()
    await userCollection.insertOne(fakeUser)

    await agent.post('/api/v1/login/activate-account').send().expect(401)
  })

  it('Should return 400 if code is invalid', async () => {
    const fakeUser = makeFakeUser()
    const accessToken = makeGenerateAccessToken().generate(fakeUser)
    await userCollection.insertOne(fakeUser)

    await agent
      .post('/api/v1/login/activate-account')
      .set('Cookie', `accessToken=${accessToken}`)
      .send({ email: fakeUser.personal.email, activationCode: 'invalid_code' })
      .expect(400)
  })

  it('Should return 400 if code is expired', async () => {
    const fakeUser = makeFakeUser()
    const activationCode = fakeUser.temporary.activationCode
    if (fakeUser.temporary) {
      fakeUser.temporary.activationCodeExpiration = new Date(Date.now() - 1000)
    }
    const accessToken = makeGenerateAccessToken().generate(fakeUser)
    await userCollection.insertOne(fakeUser)

    await agent
      .post('/api/v1/login/activate-account')
      .set('Cookie', `accessToken=${accessToken}`)
      .send({ activationCode: activationCode, email: fakeUser.personal.email })
      .expect(400)
  })

  it('Should return 400 if misses any field', async () => {
    const fakeUser = makeFakeUser()
    const accessToken = makeGenerateAccessToken().generate(fakeUser)
    await userCollection.insertOne(fakeUser)

    await agent
      .post('/api/v1/login/activate-account')
      .set('Cookie', `accessToken=${accessToken}`)
      .send()
      .expect(400)
  })

  it('Should return 400 if account is already activated', async () => {
    const fakeUser = makeFakeUser()
    const activationCode = fakeUser.temporary.activationCode
    fakeUser.settings.accountActivated = true
    const accessToken = makeGenerateAccessToken().generate(fakeUser)
    await userCollection.insertOne(fakeUser)

    await agent
      .post('/api/v1/login/activate-account')
      .set('Cookie', `accessToken=${accessToken}`)
      .send({ activationCode: activationCode, email: fakeUser.personal.email })
      .expect(400)
  })
})
