import { IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'

import { setupApp } from '@/main/express/config/app'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import { makeGenerateRefreshToken, makeGenerateAccessToken } from '@/factories/providers/token'

import { makeFakeUser } from '@/tests/__mocks__'

import { hash } from 'bcrypt'
import { Express } from 'express'
import request from 'supertest'

let app: Express

describe('patch /update-password', () => {
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
    accessToken = makeGenerateAccessToken().generate(fakeUser)
    refreshToken = await makeGenerateRefreshToken().generate(fakeUser)
  })

  it('should return 401 if user is not logged in', async () => {
    expect.assertions(0)

    await request(app).patch('/api/v1/account/update-password').send().expect(401)
  })

  it('should return 400 if password is invalid', async () => {
    expect.assertions(0)

    const hashedPassword = await hash(fakeUser.personal.password, 2)
    const userPassword = fakeUser.personal.password
    fakeUser.personal.password = hashedPassword
    await userCollection.insertOne(fakeUser)

    await request(app)
      .patch('/api/v1/account/update-password')
      .set('x-access-token', accessToken)
      .set('x-refresh-token', refreshToken)
      .send({
        currentPassword: userPassword,
        password: '123',
        passwordConfirmation: '123'
      })
      .expect(400)
  })

  it('should return 400 if passwords are missing', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await request(app)
      .patch('/api/v1/account/update-password')
      .set('x-access-token', accessToken)
      .set('x-refresh-token', refreshToken)
      .send()
      .expect(400)
  })

  it('should return 400 if current password is wrong', async () => {
    expect.assertions(0)

    const hashedPassword = await hash(fakeUser.personal.password, 2)
    fakeUser.personal.password = hashedPassword
    await userCollection.insertOne(fakeUser)

    await request(app)
      .patch('/api/v1/account/update-password')
      .set('x-access-token', accessToken)
      .set('x-refresh-token', refreshToken)
      .send({
        currentPassword: '123',
        password: '123456789',
        passwordConfirmation: '123456789'
      })
      .expect(400)
  })

  it('should return 400 if password does not match passwordConfirmation', async () => {
    expect.assertions(0)

    const hashedPassword = await hash(fakeUser.personal.password, 2)
    const userPassword = fakeUser.personal.password
    fakeUser.personal.password = hashedPassword
    await userCollection.insertOne(fakeUser)

    await request(app)
      .patch('/api/v1/account/update-password')
      .set('x-access-token', accessToken)
      .set('x-refresh-token', refreshToken)
      .send({
        currentPassword: userPassword,
        password: '123456789',
        passwordConfirmation: '1234567890'
      })
      .expect(400)
  })

  it('should return 200 if succeeds', async () => {
    expect.assertions(0)

    const hashedPassword = await hash(fakeUser.personal.password, 2)
    const userPassword = fakeUser.personal.password
    fakeUser.personal.password = hashedPassword
    await userCollection.insertOne(fakeUser)

    await request(app)
      .patch('/api/v1/account/update-password')
      .set('x-access-token', accessToken)
      .set('x-refresh-token', refreshToken)
      .send({
        currentPassword: userPassword,
        password: '123456789',
        passwordConfirmation: '123456789'
      })
      .expect(200)
  })
})
