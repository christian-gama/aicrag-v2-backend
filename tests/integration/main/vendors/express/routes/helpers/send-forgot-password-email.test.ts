import { IUser } from '@/domain'

import { MailerServiceError } from '@/application/usecases/errors'

import { MongoAdapter } from '@/infra/adapters/database'
import { CollectionProtocol } from '@/infra/database/protocols'

import { makeMongoDb } from '@/main/factories/database/mongo-db-factory'
import { ForgotPasswordEmail } from '@/main/mailer/forgot-password-email'
import app from '@/main/vendors/express/config/app'

import { makeFakeUser } from '@/tests/__mocks__'

import request from 'supertest'

describe('post /send-forgot-password-email', () => {
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

  const agent = request.agent(app)

  it('should return 400 if validation fails', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await agent
      .post('/api/v1/helpers/send-forgot-password-email')
      .send({ email: 'invalid_email' })
      .expect(400)
  })

  it('should return 500 if email is not sent', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    jest
      .spyOn(ForgotPasswordEmail.prototype, 'send')
      .mockReturnValueOnce(Promise.resolve(new MailerServiceError()))

    await agent
      .post('/api/v1/helpers/send-forgot-password-email')
      .send({ email: fakeUser.personal.email })
      .expect(500)
  })

  it('should return 200 if email is sent', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)
    jest.spyOn(ForgotPasswordEmail.prototype, 'send').mockReturnValueOnce(Promise.resolve(true))

    await agent
      .post('/api/v1/helpers/send-forgot-password-email')
      .send({ email: fakeUser.personal.email })
      .expect(200)
  })
})
