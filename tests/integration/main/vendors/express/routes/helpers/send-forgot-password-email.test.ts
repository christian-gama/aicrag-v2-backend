import { IUser } from '@/domain'

import { MailerServiceError } from '@/application/usecases/errors'

import { MongoHelper } from '@/infra/database/mongodb/helper'

import { ForgotPasswordEmail } from '@/main/mailer/forgot-password-email'
import app from '@/main/vendors/express/config/app'

import { makeFakeUser } from '@/tests/__mocks__'

import { Collection } from 'mongodb'
import request from 'supertest'

describe('POST /send-forgot-password-email', () => {
  let fakeUser: IUser
  let userCollection: Collection

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  afterEach(async () => {
    await userCollection.deleteMany({})
  })

  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)

    userCollection = MongoHelper.getCollection('users')
  })

  beforeEach(async () => {
    fakeUser = makeFakeUser()
  })

  const agent = request.agent(app)

  it('Should return 400 if validation fails', async () => {
    await userCollection.insertOne(fakeUser)

    await agent
      .post('/api/v1/helpers/send-forgot-password-email')
      .send({ email: 'invalid_email' })
      .expect(400)
  })

  it('Should return 500 if email is not sent', async () => {
    await userCollection.insertOne(fakeUser)

    jest
      .spyOn(ForgotPasswordEmail.prototype, 'send')
      .mockReturnValueOnce(Promise.resolve(new MailerServiceError()))

    await agent
      .post('/api/v1/helpers/send-forgot-password-email')
      .send({ email: fakeUser.personal.email })
      .expect(500)
  })

  it('Should return 200 if email is sent', async () => {
    await userCollection.insertOne(fakeUser)
    jest.spyOn(ForgotPasswordEmail.prototype, 'send').mockReturnValueOnce(Promise.resolve(true))

    await agent
      .post('/api/v1/helpers/send-forgot-password-email')
      .send({ email: fakeUser.personal.email })
      .expect(200)
  })
})
