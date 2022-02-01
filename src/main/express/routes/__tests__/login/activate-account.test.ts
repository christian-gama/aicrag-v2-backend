import { IUser } from '@/domain'
import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'
import App from '@/main/express/config/app'
import { makeMongoDb } from '@/main/factories/database/mongo-db-factory'
import { makeGenerateAccessToken } from '@/main/factories/providers/token'
import { makeFakeUser } from '@/tests/__mocks__'
import { Express } from 'express'
import request from 'supertest'

describe('patch /activate-account', () => {
  const client = makeMongoDb()
  let app: Express
  let accessToken: string
  let dbIsConnected = true
  let fakeUser: IUser
  let userCollection: ICollectionMethods

  afterAll(async () => {
    if (!dbIsConnected) await client.disconnect()
  })

  afterEach(async () => {
    await userCollection.deleteMany({})
  })

  beforeAll(async () => {
    dbIsConnected = MongoAdapter.client !== null
    if (!dbIsConnected) await MongoAdapter.connect(global.__MONGO_URI__)

    app = await App.setup()

    userCollection = client.collection('users')
  })

  beforeEach(async () => {
    fakeUser = makeFakeUser()
    accessToken = makeGenerateAccessToken().generate(fakeUser)
  })

  it('should return 200 if all validations succeeds', async () => {
    const activationPin = fakeUser.temporary.activationPin
    fakeUser.settings.accountActivated = false
    await userCollection.insertOne(fakeUser)

    const result = await request(app)
      .patch('/api/v1/login/activate-account')
      .set('x-access-token', accessToken)
      .send({ activationPin: activationPin, userId: fakeUser.personal.id })

    expect(result.status).toBe(200)
  })

  it('should return 401 if user does not have access token', async () => {
    await userCollection.insertOne(fakeUser)

    const result = await request(app).patch('/api/v1/login/activate-account').send()

    expect(result.status).toBe(401)
  })

  it('should return 400 if pin is invalid', async () => {
    await userCollection.insertOne(fakeUser)

    const result = await request(app)
      .patch('/api/v1/login/activate-account')
      .set('x-access-token', accessToken)
      .send({ activationPin: 'invalid_pin', userId: fakeUser.personal.id })

    expect(result.status).toBe(400)
  })

  it('should return 400 if pin is expired', async () => {
    const activationPin = fakeUser.temporary.activationPin
    fakeUser.temporary.activationPinExpiration = new Date(Date.now() - 1000)
    await userCollection.insertOne(fakeUser)

    const result = await request(app)
      .patch('/api/v1/login/activate-account')
      .set('x-access-token', accessToken)
      .send({ activationPin: activationPin, userId: fakeUser.personal.id })

    expect(result.status).toBe(400)
  })

  it('should return 400 if misses any field', async () => {
    await userCollection.insertOne(fakeUser)

    const result = await request(app).patch('/api/v1/login/activate-account').set('x-access-token', accessToken).send()

    expect(result.status).toBe(400)
  })

  it('should return 400 if account is already activated', async () => {
    const activationPin = fakeUser.temporary.activationPin
    fakeUser.settings.accountActivated = true
    await userCollection.insertOne(fakeUser)

    const result = await request(app)
      .patch('/api/v1/login/activate-account')
      .set('x-access-token', accessToken)
      .send({ activationPin: activationPin, userId: fakeUser.personal.id })

    expect(result.status).toBe(400)
  })
})
