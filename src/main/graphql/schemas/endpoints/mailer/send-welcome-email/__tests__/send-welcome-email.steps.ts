import { IUser } from '@/domain'
import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'
import { environment } from '@/main/config/environment'
import App from '@/main/express/config/app'
import { makeMongoDb } from '@/main/factories/database/mongo-db-factory'
import { WelcomeEmail } from '@/main/mailer'
import { userHelper } from '@/tests/helpers/user-helper'
import { sendWelcomeEmailMutation } from './send-welcome-email-document'
import { randomUUID } from 'crypto'
import { Express } from 'express'
import { loadFeature, defineFeature } from 'jest-cucumber'
import { resolve } from 'path'
import request from 'supertest'

const feature = loadFeature(resolve(__dirname, 'send-welcome-email.feature'))

defineFeature(feature, (test) => {
  const client = makeMongoDb()
  let app: Express
  let dbIsConnected = true
  let fakeUser: IUser
  let result: any
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

  test('having a valid email', ({ given, when, then, and }) => {
    given(/^I have an account with the email "(.*)"$/, async (email) => {
      fakeUser = await userHelper.insertUser(userCollection, {
        personal: {
          email,
          id: randomUUID(),
          name: 'any_name',
          password: 'any_password'
        }
      })
    })

    when('I request to send an email using my existent email', async () => {
      const query = sendWelcomeEmailMutation({ email: fakeUser.personal.email })

      if (process.env.TEST_SEND_EMAIL !== 'true') {
        jest.spyOn(WelcomeEmail.prototype, 'send').mockReturnValueOnce(Promise.resolve(true))
      }

      result = await request(app).post(environment.GRAPHQL.ENDPOINT).send({ query })
    })

    then(/^I should receive a message "(.*)"$/, (message) => {
      expect(result.body.data.sendWelcomeEmail.message).toBe(message)
    })

    and(/^I must receive a status code of (.*)$/, (statusCode) => {
      expect(result.status).toBe(parseInt(statusCode))
    })
  })

  test('having an invalid email', ({ given, when, then, and }) => {
    given(/^I have an account with the email "(.*)"$/, async (email) => {
      fakeUser = await userHelper.insertUser(userCollection, {
        personal: {
          email,
          id: randomUUID(),
          name: 'any_name',
          password: 'any_password'
        }
      })
    })

    when(/^I request to send an email using an invalid email "(.*)"$/, async (invalidEmail) => {
      const query = sendWelcomeEmailMutation({ email: invalidEmail })

      result = await request(app).post(environment.GRAPHQL.ENDPOINT).send({ query })
    })

    then(/^I should receive an error message "(.*)"$/, (message) => {
      expect(result.body.errors[0].message).toBe(message)
    })

    and(/^I must receive a status code of (.*)$/, (statusCode) => {
      expect(result.status).toBe(parseInt(statusCode))
    })
  })

  test('having an account already activated', ({ given, when, then, and }) => {
    given(/^I have an account with the email "(.*)" and account is already activated$/, async (email) => {
      fakeUser = await userHelper.insertUser(userCollection, {
        personal: {
          email,
          id: randomUUID(),
          name: 'any_name',
          password: 'any_password'
        },
        settings: {
          accountActivated: true
        }
      })
    })

    when('I request to send an email using using my existent email', async () => {
      const query = sendWelcomeEmailMutation({ email: fakeUser.personal.email })

      result = await request(app).post(environment.GRAPHQL.ENDPOINT).send({ query })
    })

    then(/^I should receive an error message "(.*)"$/, (message) => {
      expect(result.body.errors[0].message).toBe(message)
    })

    and(/^I must receive a status code of (.*)$/, (statusCode) => {
      expect(result.status).toBe(parseInt(statusCode))
    })
  })
})
