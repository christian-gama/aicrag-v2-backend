import { IUser } from '@/domain'
import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'
import { environment } from '@/main/config/environment'
import App from '@/main/express/config/app'
import { makeMongoDb } from '@/main/factories/database/mongo-db-factory'
import { userHelper } from '@/tests/helpers/user-helper'
import { forgotPasswordMutation } from './forgot-password-document'
import { randomUUID } from 'crypto'
import { Express } from 'express'
import { loadFeature, defineFeature } from 'jest-cucumber'
import { resolve } from 'path'
import request from 'supertest'

const feature = loadFeature(resolve(__dirname, 'forgot-password.feature'))

defineFeature(feature, (test) => {
  const client = makeMongoDb()
  let accessToken: string
  let app: Express
  let dbIsConnected = true
  let fakeUser: IUser
  let refreshToken: string
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

  test('being logged in', ({ given, when, then, and }) => {
    given('I am logged in', async () => {
      fakeUser = await userHelper.insertUser(userCollection)
      ;[accessToken, refreshToken] = await userHelper.generateToken(fakeUser)
    })

    when(/^I request to reset my password using the email "(.*)"$/, async (email) => {
      const query = forgotPasswordMutation({ email })

      result = await request(app)
        .post(environment.GRAPHQL.ENDPOINT)
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then(/^I should receive an error message "(.*)"$/, (message) => {
      expect(result.body.errors[0].message).toBe(message)
    })

    and(/^I must receive a status code of (.*)$/, (statusCode) => {
      expect(result.status).toBe(parseInt(statusCode))
    })
  })

  test('using a valid email', ({ given, when, then, and }) => {
    given(/^I have an account with the email "(.*)"$/, async (email) => {
      fakeUser = await userHelper.insertUser(userCollection, {
        personal: { email, id: randomUUID(), name: 'any_name', password: 'any_password' }
      })
    })

    given('I am logged out', () => {
      accessToken = ''
      refreshToken = ''
    })

    when(/^I request to reset my password using the email "(.*)"$/, async (email) => {
      const query = forgotPasswordMutation({ email })

      result = await request(app)
        .post(environment.GRAPHQL.ENDPOINT)
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then('I should have my resetPasswordToken updated to a new token', async () => {
      const user = (await userCollection.findOne({ 'personal.id': fakeUser.personal.id })) as IUser

      expect(user.temporary.resetPasswordToken).not.toBe(fakeUser.temporary.resetPasswordToken)
    })

    and(/^I must receive a status code of (.*)$/, (statusCode) => {
      expect(result.status).toBe(parseInt(statusCode))
    })
  })

  test('using an invalid email', ({ given, when, then, and }) => {
    given(/^I have an account with the email "(.*)"$/, async (email) => {
      fakeUser = await userHelper.insertUser(userCollection, {
        personal: { email, id: randomUUID(), name: 'any_name', password: 'any_password' }
      })
    })

    given('I am logged out', () => {
      accessToken = ''
      refreshToken = ''
    })

    when(/^I request to reset my password using the email "(.*)"$/, async (email) => {
      const query = forgotPasswordMutation({ email })

      result = await request(app)
        .post(environment.GRAPHQL.ENDPOINT)
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then(/^I should receive an error message "(.*)"$/, (message) => {
      expect(result.body.errors[0].message).toBe(message)
    })

    and(/^I must receive a status code of (.*)$/, (statusCode) => {
      expect(result.status).toBe(parseInt(statusCode))
    })
  })
})
