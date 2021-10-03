import { IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { CollectionProtocol } from '@/infra/database/protocols'

import app from '@/main/express/config/app'

import { makeFakeUser } from '@/tests/__mocks__'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import { makeGenerateAccessToken, makeGenerateRefreshToken } from '@/factories/providers/token'
import request from 'supertest'

describe('patch /update-email-by-code', () => {
  const client = makeMongoDb()
  let accessToken: string
  let fakeUser: IUser
  let refreshToken: string
  let userCollection: CollectionProtocol

  afterAll(async () => {
    await client.disconnect()
  })

  afterEach(async () => {
    await userCollection.deleteMany({})
  })

  beforeAll(async () => {
    await MongoAdapter.connect(global.__MONGO_URI__)

    userCollection = client.collection('users')
  })

  beforeEach(async () => {
    fakeUser = makeFakeUser()
    fakeUser.temporary.tempEmail = 'any_email@mail.com'
    fakeUser.temporary.tempEmailCode = 'any_code'
    fakeUser.temporary.tempEmailCodeExpiration = new Date(Date.now() + 10 * 60 * 1000)
    accessToken = makeGenerateAccessToken().generate(fakeUser)
    refreshToken = await makeGenerateRefreshToken().generate(fakeUser)
  })

  const agent = request.agent(app)

  it('should return 200 if all validations succeeds', async () => {
    expect.assertions(0)

    const tempEmailCode = fakeUser.temporary.tempEmailCode

    await userCollection.insertOne(fakeUser)

    await agent
      .patch('/api/v1/account/update-email-by-code')
      .set('Cookie', `refreshToken=${refreshToken};accessToken=${accessToken}`)
      .send({ email: fakeUser.personal.email, tempEmailCode })
      .then(() => expect(200))
  })

  it('should return 401 if user does not have access token', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await agent
      .patch('/api/v1/account/update-email-by-code')
      .send()
      .then(() => expect(401))
  })

  it('should return 400 if code is invalid', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await agent
      .patch('/api/v1/account/update-email-by-code')
      .set('Cookie', `refreshToken=${refreshToken};accessToken=${accessToken}`)
      .send({ email: fakeUser.personal.email, tempEmailCode: 'invalid_code' })
      .then(() => expect(400))
  })

  it('should return 400 if code is expired', async () => {
    expect.assertions(0)

    const tempEmailCode = fakeUser.temporary.tempEmailCode
    fakeUser.temporary.tempEmailCodeExpiration = new Date(Date.now() - 1000)

    await userCollection.insertOne(fakeUser)

    await agent
      .patch('/api/v1/account/update-email-by-code')
      .set('Cookie', `refreshToken=${refreshToken};accessToken=${accessToken}`)
      .send({ email: fakeUser.personal.email, tempEmailCode })
      .then(() => expect(400))
  })

  it('should return 400 if misses any field', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await agent
      .patch('/api/v1/account/update-email-by-code')
      .set('Cookie', `refreshToken=${refreshToken};accessToken=${accessToken}`)
      .send()
      .then(() => expect(400))
  })

  it('should return 400 if temporary email is null', async () => {
    expect.assertions(0)

    fakeUser.temporary.tempEmail = null

    await userCollection.insertOne(fakeUser)

    await agent
      .patch('/api/v1/account/update-email-by-code')
      .set('Cookie', `refreshToken=${refreshToken};accessToken=${accessToken}`)
      .send({ email: fakeUser.personal.email, tempEmailCode: 'any_code' })
      .then(() => expect(400))
  })

  it('should return 400 if temporary email code is null', async () => {
    expect.assertions(0)

    fakeUser.temporary.tempEmailCode = null

    await userCollection.insertOne(fakeUser)

    await agent
      .patch('/api/v1/account/update-email-by-code')
      .set('Cookie', `refreshToken=${refreshToken};accessToken=${accessToken}`)
      .send({ email: fakeUser.personal.email, tempEmailCode: 'any_code' })
      .then(() => expect(400))
  })

  it('should return 400 if temporary email code expiration is null', async () => {
    expect.assertions(0)

    fakeUser.temporary.tempEmailCodeExpiration = null

    await userCollection.insertOne(fakeUser)

    await agent
      .patch('/api/v1/account/update-email-by-code')
      .set('Cookie', `refreshToken=${refreshToken};accessToken=${accessToken}`)
      .send({ email: fakeUser.personal.email, tempEmailCode: 'any_code' })
      .then(() => expect(400))
  })

  it('should return 400 if email does not exist', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await agent
      .patch('/api/v1/account/update-email-by-code')
      .set('Cookie', `refreshToken=${refreshToken};accessToken=${accessToken}`)
      .send({ email: 'invalid_email', tempEmailCode: 'any_code' })
      .then(() => expect(400))
  })
})
