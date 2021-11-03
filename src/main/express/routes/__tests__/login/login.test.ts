import { IUser } from '@/domain'
import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'
import App from '@/main/express/config/app'
import { makeMongoDb } from '@/main/factories/database/mongo-db-factory'
import { makeGenerateAccessToken, makeGenerateRefreshToken } from '@/main/factories/providers/token'
import { makeFakeUser } from '@/tests/__mocks__/mock-user'
import { hash } from 'bcrypt'
import { Express } from 'express'
import request from 'supertest'

describe('post /login', () => {
  const client = makeMongoDb()
  let app: Express
  let accessToken: string
  let dbIsConnected = true
  let fakeUser: IUser
  let refreshToken: string
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
    refreshToken = await makeGenerateRefreshToken().generate(fakeUser)
  })

  it('should return 403 if user is logged in', async () => {
    await userCollection.insertOne(fakeUser)

    const result = await request(app)
      .post('/api/v1/login')
      .set('x-access-token', accessToken)
      .set('x-refresh-token', refreshToken)
      .send()

    expect(result.status).toBe(403)
  })

  it('should return 401 if data is invalid', async () => {
    const result = await request(app)
      .post('/api/v1/login')
      .send({ email: 'invalid_email@email.com', password: 'invalid_password' })

    expect(result.status).toBe(401)
  })

  it('should return 400 if miss a param or param is invalid', async () => {
    const result = await request(app).post('/api/v1/login').send()

    expect(result.status).toBe(400)
  })

  it('should return 200 if account is not activated', async () => {
    const hashedPassword = await hash(fakeUser.personal.password, 2)
    const userPassword = fakeUser.personal.password
    fakeUser.personal.password = hashedPassword
    await userCollection.insertOne(fakeUser)

    const result = await request(app)
      .post('/api/v1/login')
      .send({ email: fakeUser.personal.email, password: userPassword })

    expect(result.status).toBe(200)
  })

  it('should return 200 if all validations succeeds', async () => {
    const hashedPassword = await hash(fakeUser.personal.password, 2)
    const userPassword = fakeUser.personal.password
    fakeUser.personal.password = hashedPassword
    fakeUser.settings.accountActivated = true
    await userCollection.insertOne(fakeUser)

    const result = await request(app)
      .post('/api/v1/login')
      .send({ email: fakeUser.personal.email, password: userPassword })

    expect(result.status).toBe(200)
  })
})
