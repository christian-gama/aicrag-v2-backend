import { IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'

import { setupApp } from '@/main/express/config/app'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import { makeGenerateAccessToken, makeGenerateRefreshToken } from '@/factories/providers/token'

import { makeFakeUser } from '@/tests/__mocks__'

import { Express } from 'express'
import request from 'supertest'

let app: Express

describe('patch /update-email-by-pin', () => {
  const client = makeMongoDb()
  let accessToken: string
  let fakeUser: IUser
  let refreshToken: string
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
    fakeUser.temporary.tempEmail = 'any_email@mail.com'
    fakeUser.temporary.tempEmailPin = 'any_pin'
    fakeUser.temporary.tempEmailPinExpiration = new Date(Date.now() + 10 * 60 * 1000)
    accessToken = makeGenerateAccessToken().generate(fakeUser)
    refreshToken = await makeGenerateRefreshToken().generate(fakeUser)
  })

  it('should return 200 if all validations succeeds', async () => {
    expect.assertions(0)

    const tempEmailPin = fakeUser.temporary.tempEmailPin

    await userCollection.insertOne(fakeUser)

    await request(app)
      .patch('/api/v1/account/update-email-by-pin')
      .set('x-access-token', accessToken)
      .set('x-refresh-token', refreshToken)
      .send({ emailPin: tempEmailPin })
      .expect(200)
  })

  it('should return 401 if user does not have access token', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await request(app).patch('/api/v1/account/update-email-by-pin').send().expect(401)
  })

  it('should return 400 if code is invalid', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await request(app)
      .patch('/api/v1/account/update-email-by-pin')
      .set('x-access-token', accessToken)
      .set('x-refresh-token', refreshToken)
      .send({ emailPin: 'invalid_pin' })
      .expect(400)
  })

  it('should return 400 if pin is expired', async () => {
    expect.assertions(0)

    const tempEmailPin = fakeUser.temporary.tempEmailPin
    fakeUser.temporary.tempEmailPinExpiration = new Date(Date.now() - 1000)

    await userCollection.insertOne(fakeUser)

    await request(app)
      .patch('/api/v1/account/update-email-by-pin')
      .set('x-access-token', accessToken)
      .set('x-refresh-token', refreshToken)
      .send({ emailPin: tempEmailPin })
      .expect(400)
  })

  it('should return 400 if misses any field', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await request(app)
      .patch('/api/v1/account/update-email-by-pin')
      .set('x-access-token', accessToken)
      .set('x-refresh-token', refreshToken)
      .send()
      .expect(400)
  })

  it('should return 400 if temporary email is null', async () => {
    expect.assertions(0)

    fakeUser.temporary.tempEmail = null

    await userCollection.insertOne(fakeUser)

    await request(app)
      .patch('/api/v1/account/update-email-by-pin')
      .set('x-access-token', accessToken)
      .set('x-refresh-token', refreshToken)
      .send({ emailPin: 'any_pin' })
      .expect(400)
  })

  it('should return 400 if temporary email pin is null', async () => {
    expect.assertions(0)

    fakeUser.temporary.tempEmailPin = null

    await userCollection.insertOne(fakeUser)

    await request(app)
      .patch('/api/v1/account/update-email-by-pin')
      .set('x-access-token', accessToken)
      .set('x-refresh-token', refreshToken)
      .send({ emailPin: 'any_pin' })
      .expect(400)
  })

  it('should return 400 if temporary email pin expiration is null', async () => {
    expect.assertions(0)

    fakeUser.temporary.tempEmailPinExpiration = null

    await userCollection.insertOne(fakeUser)

    await request(app)
      .patch('/api/v1/account/update-email-by-pin')
      .set('x-access-token', accessToken)
      .set('x-refresh-token', refreshToken)
      .send({ emailPin: 'any_pin' })
      .expect(400)
  })
})
