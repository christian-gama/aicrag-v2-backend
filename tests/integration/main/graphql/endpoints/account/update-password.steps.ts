import { IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'

import { setupApp } from '@/main/express/config/app'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'

import { updatePasswordMutation } from '@/tests/helpers/queries'
import { userHelper } from '@/tests/helpers/user-helper'

import { hash } from 'bcrypt'
import { randomUUID } from 'crypto'
import { Express } from 'express'
import { defineFeature, loadFeature } from 'jest-cucumber'
import path from 'path'
import request from 'supertest'

const feature = loadFeature(path.resolve(__dirname, 'update-password.feature'))

defineFeature(feature, (test) => {
  const client = makeMongoDb()
  let accessToken: string
  let app: Express
  let fakeUser: IUser
  let refreshToken: string
  let result: any
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

  test('requesting to update my password being logged out', ({ given, when, then, and }) => {
    expect.hasAssertions()

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
        .post('/graphql')
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

  test('requesting to update my password with correct input', ({ given, when, then, and }) => {
    expect.hasAssertions()

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
        .post('/graphql')
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

  test('requesting to update my password with correct invalid current password', ({ given, when, then, and }) => {
    expect.hasAssertions()

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
        .post('/graphql')
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

  test('requesting to update my email using an invalid password', ({ given, when, then, and }) => {
    expect.hasAssertions()

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
        .post('/graphql')
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
