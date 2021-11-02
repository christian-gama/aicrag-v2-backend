import { IUser } from '@/domain'

import { MailerServiceError } from '@/application/errors'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'

import App from '@/main/express/config/app'
import { RecoverPasswordEmail } from '@/main/mailer/recover-password-email'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'

import { makeFakeUser } from '@/tests/__mocks__'

import { Express } from 'express'
import request from 'supertest'

describe('post /send-recover-password-email', () => {
  const client = makeMongoDb()
  let app: Express
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
    fakeUser.temporary.resetPasswordToken = 'any_token'
  })

  it('should return 400 if validation fails', async () => {
    await userCollection.insertOne(fakeUser)

    const result = await request(app).post('/api/v1/mailer/send-forgot-password-email').send({ email: 'invalid_email' })

    expect(result.status).toBe(400)
  })

  it('should return 500 if email is not sent', async () => {
    await userCollection.insertOne(fakeUser)

    jest.spyOn(RecoverPasswordEmail.prototype, 'send').mockReturnValueOnce(Promise.resolve(new MailerServiceError()))

    const result = await request(app)
      .post('/api/v1/mailer/send-forgot-password-email')
      .send({ email: fakeUser.personal.email })

    expect(result.status).toBe(500)
  })

  it('should return 200 if email is sent', async () => {
    await userCollection.insertOne(fakeUser)

    if (process.env.TEST_SEND_EMAIL !== 'true') {
      jest.spyOn(RecoverPasswordEmail.prototype, 'send').mockReturnValueOnce(Promise.resolve(true))
    }

    const result = await request(app)
      .post('/api/v1/mailer/send-forgot-password-email')
      .send({ email: fakeUser.personal.email })

    expect(result.status).toBe(200)
  })
})
