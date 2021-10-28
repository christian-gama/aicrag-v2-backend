import { IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'

import { setupApp } from '@/main/express/config/app'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import { makeGenerateAccessToken } from '@/factories/providers/token'

import { makeFakeUser } from '@/tests/__mocks__'

import { Express } from 'express'
import request from 'supertest'

let app: Express

describe('patch /activate-account', () => {
  const client = makeMongoDb()
  let accessToken: string
  let fakeUser: IUser
  let userCollection: ICollectionMethods

  afterAll(async () => {
    await client.disconnect()
  })

  afterEach(async () => {
    await userCollection.deleteMany({})
  })

  beforeAll(async () => {
    app = await setupApp()

    await MongoAdapter.connect(global.__MONGO_URI__)

    userCollection = client.collection('users')
  })

  beforeEach(async () => {
    fakeUser = makeFakeUser()
    accessToken = makeGenerateAccessToken().generate(fakeUser)
  })

  it('should return 200 if all validations succeeds', async () => {
    expect.assertions(0)

    const activationPin = fakeUser.temporary.activationPin
    fakeUser.settings.accountActivated = false
    await userCollection.insertOne(fakeUser)

    await request(app)
      .patch('/api/v1/login/activate-account')
      .set('x-access-token', accessToken)
      .send({ activationPin: activationPin, email: fakeUser.personal.email })
      .expect(200)
  })

  it('should return 401 if user does not have access token', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await request(app).patch('/api/v1/login/activate-account').send().expect(401)
  })

  it('should return 400 if pin is invalid', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await request(app)
      .patch('/api/v1/login/activate-account')
      .set('x-access-token', accessToken)
      .send({ activationPin: 'invalid_pin', email: fakeUser.personal.email })
      .expect(400)
  })

  it('should return 400 if pin is expired', async () => {
    expect.assertions(0)

    const activationPin = fakeUser.temporary.activationPin
    fakeUser.temporary.activationPinExpiration = new Date(Date.now() - 1000)
    await userCollection.insertOne(fakeUser)

    await request(app)
      .patch('/api/v1/login/activate-account')
      .set('x-access-token', accessToken)
      .send({ activationPin: activationPin, email: fakeUser.personal.email })
      .expect(400)
  })

  it('should return 400 if misses any field', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await request(app).patch('/api/v1/login/activate-account').set('x-access-token', accessToken).send().expect(400)
  })

  it('should return 400 if account is already activated', async () => {
    expect.assertions(0)

    const activationPin = fakeUser.temporary.activationPin
    fakeUser.settings.accountActivated = true
    await userCollection.insertOne(fakeUser)

    await request(app)
      .patch('/api/v1/login/activate-account')
      .set('x-access-token', accessToken)
      .send({ activationPin: activationPin, email: fakeUser.personal.email })
      .expect(400)
  })
})
