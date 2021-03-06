import { IUser } from '@/domain'
import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'
import { environment } from '@/main/config/environment'
import App from '@/main/express/config/app'
import { makeMongoDb } from '@/main/factories/database/mongo-db-factory'
import { userHelper } from '@/tests/helpers/user-helper'
import { updatePasswordMutation } from './update-password-document'
import { hash } from 'bcrypt'
import { randomUUID } from 'crypto'
import { Express } from 'express'
import { defineFeature, loadFeature } from 'jest-cucumber'
import { resolve } from 'path'
import request from 'supertest'

const feature = loadFeature(resolve(__dirname, 'update-password.feature'))

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

  test('being logged out', ({ given, when, then, and }) => {
    given(/^My current password is "(.*)"$/, async (currentPassword) => {
      await userHelper.insertUser(userCollection, {
        personal: {
          email: 'any_email@mail.com',
          id: randomUUID(),
          name: 'any_name',
          password: await hash(currentPassword, 2)
        }
      })
    })

    given('I am logged out', () => {
      accessToken = ''
      refreshToken = ''
    })

    when('I request to update my password with the following valid input:', async (table) => {
      const input = {
        currentPassword: table[0].currentPassword,
        password: table[0].password,
        passwordConfirmation: table[0].passwordConfirmation
      }

      const query = updatePasswordMutation(input)

      result = await request(app)
        .post(environment.GRAPHQL.ENDPOINT)
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then(/^I should see an error that contains a message "(.*)"$/, (message) => {
      expect(result.body.errors[0].message).toBe(message)
    })

    and(/^I must receive a status code of (.*)$/, (statusCode) => {
      expect(result.status).toBe(parseInt(statusCode))
    })
  })

  test('using a valid input', ({ given, when, then, and }) => {
    given(/^My current password is "(.*)"$/, async (currentPassword) => {
      fakeUser = await userHelper.insertUser(userCollection, {
        personal: {
          email: 'any_email@mail.com',
          id: randomUUID(),
          name: 'any_name',
          password: await hash(currentPassword, 2)
        }
      })
    })

    given('I am logged in', async () => {
      ;[accessToken, refreshToken] = await userHelper.generateToken(fakeUser)
    })

    when('I request to update my password with the following valid input:', async (table) => {
      const input = {
        currentPassword: table[0].currentPassword,
        password: table[0].password,
        passwordConfirmation: table[0].passwordConfirmation
      }

      const query = updatePasswordMutation(input)

      result = await request(app)
        .post(environment.GRAPHQL.ENDPOINT)
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then('I should have my password updated', () => {
      expect(result.body.data.updatePassword).toBeTruthy()
    })

    and('I should have my temporary email removed', async () => {
      const result = (await userCollection.findOne({ 'personal.id': fakeUser.personal.id })) as IUser

      expect(result.temporary.tempEmail).toBeNull()
    })

    and(/^I must receive a status code of (.*)$/, (statusCode) => {
      expect(result.status).toBe(parseInt(statusCode))
    })
  })

  test('using an invalid current password', ({ given, when, then, and }) => {
    given(/^My current password is "(.*)"$/, async (currentPassword) => {
      fakeUser = await userHelper.insertUser(userCollection, {
        personal: {
          email: 'any_email@mail.com',
          id: randomUUID(),
          name: 'any_name',
          password: await hash(currentPassword, 2)
        }
      })
    })

    given('I am logged in', async () => {
      ;[accessToken, refreshToken] = await userHelper.generateToken(fakeUser)
    })

    when('I request to update my password with the following invalid current password:', async (table) => {
      const input = {
        currentPassword: table[0].currentPassword,
        password: table[0].password,
        passwordConfirmation: table[0].passwordConfirmation
      }

      const query = updatePasswordMutation(input)

      result = await request(app)
        .post(environment.GRAPHQL.ENDPOINT)
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then(/^I should receive an error with a message "(.*)"$/, (message) => {
      expect(result.body.errors[0].message).toBe(message)
    })

    and(/^I must receive a status code of (.*)$/, (statusCode) => {
      expect(result.status).toBe(parseInt(statusCode))
    })
  })

  test('using an invalid password', ({ given, when, then, and }) => {
    given(/^My current password is "(.*)"$/, async (currentPassword) => {
      fakeUser = await userHelper.insertUser(userCollection, {
        personal: {
          email: 'any_email@mail.com',
          id: randomUUID(),
          name: 'any_name',
          password: await hash(currentPassword, 2)
        }
      })
    })

    given('I am logged in', async () => {
      ;[accessToken, refreshToken] = await userHelper.generateToken(fakeUser)
    })

    when('I request to update my password with the following invalid passwords:', async (table) => {
      const input = {
        currentPassword: table[0].currentPassword,
        password: table[0].password,
        passwordConfirmation: table[0].passwordConfirmation
      }

      const query = updatePasswordMutation(input)

      result = await request(app)
        .post(environment.GRAPHQL.ENDPOINT)
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then(/^I should receive an error with a message "(.*)"$/, (message) => {
      expect(result.body.errors[0].message).toBe(message)
    })

    and(/^I must receive a status code of (.*)$/, (statusCode) => {
      expect(result.status).toBe(parseInt(statusCode))
    })
  })
})
