import { IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'

import { setupApp } from '@/main/express/config/app'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'

import { updateUserMutation } from '@/tests/helpers/queries'
import { userHelper } from '@/tests/helpers/user-helper'

import { Express } from 'express'
import { defineFeature, loadFeature } from 'jest-cucumber'
import MockDate from 'mockdate'
import path from 'path'
import request from 'supertest'

const feature = loadFeature(path.resolve(__dirname, 'update-user.feature'))

defineFeature(feature, (test) => {
  const client = makeMongoDb()
  let accessToken: string
  let app: Express
  let fakeUser: IUser
  let refreshToken: string
  let result: any
  let userCollection: ICollectionMethods

  afterAll(async () => {
    MockDate.reset()

    await client.disconnect()
  })

  afterEach(async () => {
    await userCollection.deleteMany({})
  })

  beforeAll(async () => {
    MockDate.set(new Date())

    app = await setupApp()

    await MongoAdapter.connect(global.__MONGO_URI__)

    userCollection = client.collection('users')
  })

  test('being logged out', ({ given, when, then, and }) => {
    expect.hasAssertions()

    given('I am logged out', () => {
      accessToken = ''
      refreshToken = ''
    })

    when('I request to update me with the following input:', async (table) => {
      const input = {
        currency: table[0].currency,
        email: table[0].email,
        name: table[0].name
      }

      const query = updateUserMutation(input)

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

  test('updating only currency', ({ given, when, then, and }) => {
    expect.hasAssertions()

    given('I am logged in', async () => {
      fakeUser = await userHelper.insertUser(userCollection)
      ;[accessToken, refreshToken] = await userHelper.generateToken(fakeUser)
    })

    when(/^I request to update my currency settings with "(.*)"$/, async (currency) => {
      const query = updateUserMutation({ currency })

      result = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then(/^I should have my currency updated to "(.*)"$/, (currency) => {
      expect(result.body.data.updateUser.user.settings.currency).toBe(currency)
    })

    and(/^I must receive a status code of (.*)$/, (statusCode) => {
      expect(result.status).toBe(parseInt(statusCode))
    })
  })

  test('updating only email using a valid email', ({ given, when, then, and }) => {
    expect.hasAssertions()

    given('I am logged in', async () => {
      fakeUser = await userHelper.insertUser(userCollection)
      ;[accessToken, refreshToken] = await userHelper.generateToken(fakeUser)
    })

    when(/^I request to update my email with "(.*)"$/, async (email) => {
      const query = updateUserMutation({ email })

      result = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then(/^I should have my temporary email set to "(.*)"$/, async (email) => {
      fakeUser = (await userCollection.findOne({ 'personal.id': fakeUser.personal.id })) as IUser

      expect(fakeUser.temporary.tempEmail).toBe(email)
    })

    and('I should have my temporary email code set to a random code', () => {
      expect(fakeUser.temporary.tempEmailPin).toBeDefined()
    })

    and(/^I should have my temporary email code expiration set to expire in (.*) minutes$/, (expiration) => {
      expect(fakeUser.temporary.tempEmailPinExpiration).toStrictEqual(new Date(Date.now() + expiration * 60 * 1000))
    })

    and(/^I must receive a status code of (.*)$/, (statusCode) => {
      expect(result.status).toBe(parseInt(statusCode))
    })
  })

  test('updating only email using an invalid email', ({ given, when, then, and }) => {
    expect.hasAssertions()

    given('I am logged in', async () => {
      fakeUser = await userHelper.insertUser(userCollection)
      ;[accessToken, refreshToken] = await userHelper.generateToken(fakeUser)
    })

    when(/^I request to update my email with "(.*)"$/, async (email) => {
      const query = updateUserMutation({ email })

      result = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then(/^I should receive an error that contains a message "(.*)"$/, (message) => {
      expect(result.body.errors[0].message).toBe(message)
    })

    and(/^I must receive a status code of (.*)$/, (statusCode) => {
      expect(result.status).toBe(parseInt(statusCode))
    })
  })

  test('updating only name using a valid name', ({ given, when, then, and }) => {
    expect.hasAssertions()

    given('I am logged in', async () => {
      fakeUser = await userHelper.insertUser(userCollection)
      ;[accessToken, refreshToken] = await userHelper.generateToken(fakeUser)
    })

    when(/^I request to update my name with "(.*)"$/, async (name) => {
      const query = updateUserMutation({ name })

      result = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then(/^I should have my name set to "(.*)"$/, (name) => {
      expect(result.body.data.updateUser.user.personal.name).toBe(name)
    })

    and(/^I must receive a status code of (.*)$/, (statusCode) => {
      expect(result.status).toBe(parseInt(statusCode))
    })
  })

  test('updating only name using an invalid name', ({ given, when, then, and }) => {
    expect.hasAssertions()

    given('I am logged in', async () => {
      fakeUser = await userHelper.insertUser(userCollection)
      ;[accessToken, refreshToken] = await userHelper.generateToken(fakeUser)
    })

    when(/^I request to update my name with "(.*)"$/, async (name) => {
      const query = updateUserMutation({ name })

      result = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then(/^I should receive an error that contains a message "(.*)"$/, (message) => {
      expect(result.body.errors[0].message).toBe(message)
    })

    and(/^I must receive a status code of (.*)$/, (statusCode) => {
      expect(result.status).toBe(parseInt(statusCode))
    })
  })
})
