import { IUser } from '@/domain'

import { MailerServiceError } from '@/application/usecases/errors'

import { MongoHelper } from '@/infra/database/mongodb/helper'

import { makeGenerateAccessToken } from '@/main/factories/providers/token'
import { WelcomeEmail } from '@/main/mailer/welcome-email'
import app from '@/main/vendors/express/config/app'

import { makeFakeUser } from '@/tests/__mocks__'

import { Collection } from 'mongodb'
import request from 'supertest'

describe('POST /send-welcome-email', () => {
  let fakeUser: IUser
  let accessToken: string
  let userCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)

    userCollection = MongoHelper.getCollection('users')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    fakeUser = makeFakeUser()
    await userCollection.insertOne(fakeUser)
    accessToken = makeGenerateAccessToken().generate(fakeUser)
  })

  afterEach(async () => {
    await userCollection.deleteMany({})
  })

  const agent = request.agent(app)

  it('Should return 401 there is no access token', async () => {
    await agent.post('/api/v1/helpers/send-welcome-email').send().expect(401)
  })

  it('Should return 400 if validation fails', async () => {
    await agent
      .post('/api/v1/helpers/send-welcome-email')
      .set('Cookie', `accessToken=${accessToken}`)
      .send({ email: 'invalid_email' })
      .expect(400)
  })

  it('Should return 500 if email is not sent', async () => {
    jest
      .spyOn(WelcomeEmail.prototype, 'send')
      .mockReturnValueOnce(Promise.resolve(new MailerServiceError()))

    await agent
      .post('/api/v1/helpers/send-welcome-email')
      .set('Cookie', `accessToken=${accessToken}`)
      .send({ email: fakeUser.personal.email })
      .expect(500)
  })

  it('Should return 200 email is sent', async () => {
    jest.spyOn(WelcomeEmail.prototype, 'send').mockReturnValueOnce(Promise.resolve(true))

    await agent
      .post('/api/v1/helpers/send-welcome-email')
      .set('Cookie', `accessToken=${accessToken}`)
      .send({ email: fakeUser.personal.email })
      .expect(200)
  })
})
