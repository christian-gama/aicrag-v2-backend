import { IUser } from '@/domain'

import { MailerServiceError } from '@/application/errors'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'

import { setupApp } from '@/main/express/config/app'
import { WelcomeEmail } from '@/main/mailer/welcome-email'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'

import { makeFakeUser } from '@/tests/__mocks__'

import { Express } from 'express'
import request from 'supertest'

let app: Express

describe('mutation sendWelcomeEmail', () => {
  const client = makeMongoDb()
  let fakeUser: IUser
  let query: string
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
    fakeUser.temporary.activationPinExpiration = new Date(Date.now() + 60 * 1000)
    query = `
      mutation {
        sendWelcomeEmail (input: { email: "${fakeUser.personal.email}" }) {
          message
        }
      }
    `
  })

  it('should return 400 if validation fails', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)
    query = query.replace(fakeUser.personal.email, 'invalid@mail.com')

    await request(app).post('/graphql').send({ query }).expect(400)
  })

  it('should return 403 if account is already activated', async () => {
    expect.assertions(0)

    fakeUser.settings.accountActivated = true
    await userCollection.insertOne(fakeUser)

    await request(app).post('/graphql').send({ query }).expect(403)
  })

  it('should return 500 if email is not sent', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    jest.spyOn(WelcomeEmail.prototype, 'send').mockReturnValueOnce(Promise.resolve(new MailerServiceError()))

    await request(app).post('/graphql').send({ query }).expect(500)
  })

  it('should return 200 if email is sent', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    jest.spyOn(WelcomeEmail.prototype, 'send').mockReturnValueOnce(Promise.resolve(true))

    await request(app).post('/graphql').send({ query }).expect(200)
  })
})
