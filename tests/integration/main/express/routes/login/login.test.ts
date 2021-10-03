import { IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { CollectionProtocol } from '@/infra/database/protocols'

import app from '@/main/express/config/app'

import { makeFakeUser } from '@/tests/__mocks__/mock-user'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import { makeGenerateAccessToken, makeGenerateRefreshToken } from '@/factories/providers/token'
import { hash } from 'bcrypt'
import request from 'supertest'

describe('post /login', () => {
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
    accessToken = makeGenerateAccessToken().generate(fakeUser)
    refreshToken = await makeGenerateRefreshToken().generate(fakeUser)
  })

  const agent = request.agent(app)

  it('should return 403 if user is logged in', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await agent
      .post('/api/v1/login')
      .set('Cookie', `refreshToken=${refreshToken};accessToken=${accessToken}`)
      .send()
      .then(() => expect(403))
  })

  it('should return 401 if credentials are invalid', async () => {
    expect.assertions(0)

    await agent
      .post('/api/v1/login')
      .send({ email: 'invalid_email@email.com', password: 'invalid_password' })
      .then(() => expect(401))
  })

  it('should return 400 if miss a param or param is invalid', async () => {
    expect.assertions(0)

    await agent
      .post('/api/v1/login')
      .send()
      .then(() => expect(400))
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
      .then(() => expect(200))
  })

  it('should return 200 if all validations succeeds', async () => {
    expect.assertions(0)

    const hashedPassword = await hash(fakeUser.personal.password, 2)
    const userPassword = fakeUser.personal.password
    fakeUser.personal.password = hashedPassword
    fakeUser.settings.accountActivated = true
    await userCollection.insertOne(fakeUser)

    await agent
      .post('/api/v1/login')
      .send({ email: fakeUser.personal.email, password: userPassword })
      .then(() => expect(200))
  })
})
