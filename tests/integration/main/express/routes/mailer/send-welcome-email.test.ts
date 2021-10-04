import { IUser } from '@/domain'

import { MailerServiceError } from '@/application/errors'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { CollectionProtocol } from '@/infra/database/protocols'

import app from '@/main/express/config/app'
import { WelcomeEmail } from '@/main/mailer/welcome-email'

import { makeFakeUser } from '@/tests/__mocks__'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import request from 'supertest'

describe('post /send-welcome-email', () => {
  const client = makeMongoDb()
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
  })

  it('should return 400 if validation fails', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await request(app)
      .post('/api/v1/mailer/send-welcome-email')
      .send({ email: 'invalid_email' })
      .expect(400)
  })

  it('should return 403 if account is already activated', async () => {
    expect.assertions(0)

    fakeUser.settings.accountActivated = true
    await userCollection.insertOne(fakeUser)

    await request(app)
      .post('/api/v1/mailer/send-welcome-email')
      .send({ email: fakeUser.personal.email })
      .expect(403)
  })

  it('should return 500 if email is not sent', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    jest
      .spyOn(WelcomeEmail.prototype, 'send')
      .mockReturnValueOnce(Promise.resolve(new MailerServiceError()))

    await request(app)
      .post('/api/v1/mailer/send-welcome-email')
      .send({ email: fakeUser.personal.email })
      .expect(500)
  })

  it('should return 200 if email is sent', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    jest.spyOn(WelcomeEmail.prototype, 'send').mockReturnValueOnce(Promise.resolve(true))

    await request(app)
      .post('/api/v1/mailer/send-welcome-email')
      .send({ email: fakeUser.personal.email })
      .expect(200)
  })
})
