import { IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'

import { setupApp } from '@/main/express/config/app'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'

import { updateEmailByCodeMutation } from '@/tests/helpers/queries'
import { userHelper } from '@/tests/helpers/user-helper'

import { Express } from 'express'
import { loadFeature, defineFeature } from 'jest-cucumber'
import path from 'path'
import request from 'supertest'

const feature = loadFeature(path.resolve(__dirname, 'update-email-by-code.feature'))

defineFeature(feature, (test) => {
  const client = makeMongoDb()
  let accessToken: string
  let app: Express
  let fakeUser: IUser
  let refreshToken: string
  let userCollection: ICollectionMethods
  let result: request.Response

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

  test('requesting to update my email being logged out', ({ given, when, then, and }) => {
    expect.hasAssertions()

    given('The following temporaries:', async (table) => {
      fakeUser = await userHelper.insertUser(userCollection, {
        temporary: {
          tempEmail: table[0]['Temporary email'],
          tempEmailCode: table[0]['Temporary email code'],
          tempEmailCodeExpiration: new Date(Date.now() + 1000 * 60 * 60)
        }
      })
    })

    given('I am logged out', () => {
      accessToken = ''
      refreshToken = ''
    })

    when(/^I request to update my email using "(.*)"$/, async (emailCode) => {
      const query = updateEmailByCodeMutation({ emailCode })

      result = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then(/^I should see an error that contains a message "(.*)"$/, (message) => {
      expect(result.body.errors[0].message).toBe(message)
    })

    and(/^I must receive a status code of (\d+)$/, (statusCode) => {
      expect(result.statusCode).toBe(+statusCode)
    })
  })

  test('requesting to update my email using a temporary valid code', ({ given, when, then, and }) => {
    expect.hasAssertions()

    given('The following temporaries:', async (table) => {
      fakeUser = await userHelper.insertUser(userCollection, {
        temporary: {
          tempEmail: table[0]['Temporary email'],
          tempEmailCode: table[0]['Temporary email code'],
          tempEmailCodeExpiration: new Date(Date.now() + 1000 * 60 * 60)
        }
      })
    })

    given('I am logged in', async () => {
      ;[accessToken, refreshToken] = await userHelper.generateToken(fakeUser)
    })

    when(/^I request to update my email using "(.*)"$/, async (emailCode) => {
      const query = updateEmailByCodeMutation({ emailCode })

      result = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then('I should have my email updated', () => {
      expect(result.body.data.updateEmailByCode.user.personal.email).toBe('any_email@mail.com')
    })

    and('I should have my temporary email removed', async () => {
      fakeUser = (await userCollection.findOne({ 'personal.id': fakeUser.personal.id })) as IUser

      expect(fakeUser.temporary.tempEmail).toBeNull()
    })

    and(/^I must receive a status code of (\d+)$/, (statusCode) => {
      expect(result.statusCode).toBe(+statusCode)
    })
  })

  test('requesting to update my email using a temporary invalid code', ({ given, when, then, and }) => {
    expect.hasAssertions()

    given('The following temporaries:', async (table) => {
      fakeUser = await userHelper.insertUser(userCollection, {
        temporary: {
          tempEmail: table[0]['Temporary email'],
          tempEmailCode: table[0]['Temporary email code'],
          tempEmailCodeExpiration: new Date(Date.now() + 1000 * 60 * 60)
        }
      })
    })

    given('I am logged in', async () => {
      ;[accessToken, refreshToken] = await userHelper.generateToken(fakeUser)
    })

    when(/^I request to update my email using "(.*)"$/, async (emailCode) => {
      const query = updateEmailByCodeMutation({ emailCode })

      result = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then(/^I should have receive an error that contains a message "(.*)"$/, (message) => {
      expect(result.body.errors[0].message).toBe(message)
    })

    and(/^I must receive a status code of (\d+)$/, (statusCode) => {
      expect(result.statusCode).toBe(+statusCode)
    })
  })
})
