import { IUser } from '@/domain'

import { MailerServiceError } from '@/application/usecases/errors'

import { MongoAdapter } from '@/infra/adapters/database'

import { makeGenerateAccessToken } from '@/main/factories/providers/token'
import { WelcomeEmail } from '@/main/mailer/welcome-email'
import app from '@/main/vendors/express/config/app'

import { makeFakeUser } from '@/tests/__mocks__'

import { Collection } from 'mongodb'
import request from 'supertest'

describe('post /send-welcome-email', () => {
  let accessToken: string
  let fakeUser: IUser
  let userCollection: Collection

  afterAll(async () => {
    await MongoAdapter.disconnect()
  })

  afterEach(async () => {
    await userCollection.deleteMany({})
  })

  beforeAll(async () => {
    await MongoAdapter.connect(global.__MONGO_URI__)

    userCollection = MongoAdapter.getCollection('users')
  })

  beforeEach(async () => {
    fakeUser = makeFakeUser()
    accessToken = makeGenerateAccessToken().generate(fakeUser)
  })

  const agent = request.agent(app)

  it('should return 401 if there is no access token', async () => {
    expect.assertions(0)

    await agent.post('/api/v1/helpers/send-welcome-email').send().expect(401)
  })

  it('should return 400 if validation fails', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await agent
      .post('/api/v1/helpers/send-welcome-email')
      .set('Cookie', `accessToken=${accessToken}`)
      .send({ email: 'invalid_email' })
      .expect(400)
  })

  it('should return 403 if account is already activated', async () => {
    expect.assertions(0)

    fakeUser.settings.accountActivated = true
    await userCollection.insertOne(fakeUser)

    await agent
      .post('/api/v1/helpers/send-welcome-email')
      .set('Cookie', `accessToken=${accessToken}`)
      .send({ email: fakeUser.personal.email })
      .expect(403)
  })

  it('should return 500 if email is not sent', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    jest
      .spyOn(WelcomeEmail.prototype, 'send')
      .mockReturnValueOnce(Promise.resolve(new MailerServiceError()))

    await agent
      .post('/api/v1/helpers/send-welcome-email')
      .set('Cookie', `accessToken=${accessToken}`)
      .send({ email: fakeUser.personal.email })
      .expect(500)
  })

  it('should return 200 if email is sent', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    jest.spyOn(WelcomeEmail.prototype, 'send').mockReturnValueOnce(Promise.resolve(true))

    await agent
      .post('/api/v1/helpers/send-welcome-email')
      .set('Cookie', `accessToken=${accessToken}`)
      .send({ email: fakeUser.personal.email })
      .expect(200)
  })
})
