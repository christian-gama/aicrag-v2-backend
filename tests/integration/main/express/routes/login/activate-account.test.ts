import { IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database'
import { CollectionProtocol } from '@/infra/database/protocols'

import app from '@/main/express/config/app'

import { makeFakeUser } from '@/tests/__mocks__'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import { makeGenerateAccessToken } from '@/factories/providers/token'
import request from 'supertest'

describe('post /activate-account', () => {
  const client = makeMongoDb()
  let accessToken: string
  let fakeUser: IUser
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
    accessToken = makeGenerateAccessToken().generate(fakeUser)
  })

  const agent = request.agent(app)

  it('should return 200 if all validations succeds', async () => {
    expect.assertions(0)

    const activationCode = fakeUser.temporary.activationCode
    fakeUser.settings.accountActivated = false
    await userCollection.insertOne(fakeUser)

    await agent
      .patch('/api/v1/login/activate-account')
      .set('Cookie', `accessToken=${accessToken}`)
      .send({ activationCode: activationCode, email: fakeUser.personal.email })
      .then(() => expect(200))
  })

  it('should return 401 if user does not have access token', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await agent
      .patch('/api/v1/login/activate-account')
      .send()
      .then(() => expect(401))
  })

  it('should return 400 if code is invalid', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await agent
      .patch('/api/v1/login/activate-account')
      .set('Cookie', `accessToken=${accessToken}`)
      .send({ activationCode: 'invalid_code', email: fakeUser.personal.email })
      .then(() => expect(400))
  })

  it('should return 400 if code is expired', async () => {
    expect.assertions(0)

    const activationCode = fakeUser.temporary.activationCode
    fakeUser.temporary.activationCodeExpiration = new Date(Date.now() - 1000)
    await userCollection.insertOne(fakeUser)

    await agent
      .patch('/api/v1/login/activate-account')
      .set('Cookie', `accessToken=${accessToken}`)
      .send({ activationCode: activationCode, email: fakeUser.personal.email })
      .then(() => expect(400))
  })

  it('should return 400 if misses any field', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await agent
      .patch('/api/v1/login/activate-account')
      .set('Cookie', `accessToken=${accessToken}`)
      .send()
      .then(() => expect(400))
  })

  it('should return 400 if account is already activated', async () => {
    expect.assertions(0)

    const activationCode = fakeUser.temporary.activationCode
    fakeUser.settings.accountActivated = true
    await userCollection.insertOne(fakeUser)

    await agent
      .patch('/api/v1/login/activate-account')
      .set('Cookie', `accessToken=${accessToken}`)
      .send({ activationCode: activationCode, email: fakeUser.personal.email })
      .then(() => expect(400))
  })
})
