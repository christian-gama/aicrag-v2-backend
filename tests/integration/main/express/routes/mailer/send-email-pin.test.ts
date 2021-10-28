import { IUser } from '@/domain'

import { MailerServiceError } from '@/application/errors'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'

import { setupApp } from '@/main/express/config/app'
import { EmailPin } from '@/main/mailer'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'

import { makeFakeUser } from '@/tests/__mocks__'

import { Express } from 'express'
import request from 'supertest'

let app: Express

describe('post /send-email-pin', () => {
  const client = makeMongoDb()
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
  })

  it('should return 400 if validation fails', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await request(app).post('/api/v1/mailer/send-email-pin').send({ email: 'invalid_email' }).expect(400)
  })

  it('should return 400 if temp email does not exist', async () => {
    expect.assertions(0)

    fakeUser.temporary.tempEmail = null
    await userCollection.insertOne(fakeUser)

    await request(app).post('/api/v1/mailer/send-email-pin').send({ email: fakeUser.personal.email }).expect(400)
  })

  it('should return 500 if email is not sent', async () => {
    expect.assertions(0)

    fakeUser.temporary.tempEmail = 'any_email'
    await userCollection.insertOne(fakeUser)

    jest.spyOn(EmailPin.prototype, 'send').mockReturnValueOnce(Promise.resolve(new MailerServiceError()))

    await request(app).post('/api/v1/mailer/send-email-pin').send({ email: fakeUser.personal.email }).expect(500)
  })

  it('should return 200 if email is sent', async () => {
    expect.assertions(0)

    fakeUser.temporary.tempEmail = 'any_email'
    await userCollection.insertOne(fakeUser)

    if (process.env.TEST_SEND_EMAIL !== 'true') {
      jest.spyOn(EmailPin.prototype, 'send').mockReturnValueOnce(Promise.resolve(true))
    }

    await request(app).post('/api/v1/mailer/send-email-pin').send({ email: fakeUser.personal.email }).expect(200)
  })
})
