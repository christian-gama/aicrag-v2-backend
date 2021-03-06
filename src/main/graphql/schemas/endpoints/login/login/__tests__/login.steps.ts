import { IUser } from '@/domain'
import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'
import { environment } from '@/main/config/environment'
import App from '@/main/express/config/app'
import { makeMongoDb } from '@/main/factories/database/mongo-db-factory'
import { userHelper } from '@/tests/helpers/user-helper'
import { loginMutation } from './login-document'
import { hash } from 'bcrypt'
import { randomUUID } from 'crypto'
import { Express } from 'express'
import { loadFeature, defineFeature } from 'jest-cucumber'
import { resolve } from 'path'
import request from 'supertest'

const feature = loadFeature(resolve(__dirname, 'login.feature'))

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

  test('i should login using valid credentials and with my account activated', ({ given, when, then, and }) => {
    given('I have an account with the following credentials:', async (table) => {
      fakeUser = await userHelper.insertUser(userCollection, {
        personal: {
          email: table[0].email,
          id: randomUUID(),
          name: 'any_name',
          password: await hash(table[0].password, 2)
        },
        settings: {
          accountActivated: table[0].accountActivated === 'true',
          currency: 'BRL',
          handicap: 1
        }
      })
    })

    given('I am logged out', () => {
      accessToken = ''
      refreshToken = ''
    })

    when('I request to login using the following credentials:', async (table) => {
      const query = loginMutation({ email: table[0].email, password: table[0].password })

      result = await request(app)
        .post(environment.GRAPHQL.ENDPOINT)
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then('I should be logged in', () => {
      expect(result.body.data.login.user).toStrictEqual({
        personal: {
          email: fakeUser.personal.email,
          id: fakeUser.personal.id,
          name: fakeUser.personal.name
        },
        settings: {
          currency: fakeUser.settings.currency
        }
      })
    })

    and(/^I must receive a status code of (.*)$/, (statusCode) => {
      expect(result.status).toBe(parseInt(statusCode))
    })
  })

  test('i should not login using valid credentials but with an inactive account', ({ given, when, then, and }) => {
    given('I have an account with the following credentials:', async (table) => {
      fakeUser = await userHelper.insertUser(userCollection, {
        personal: {
          email: table[0].email,
          id: randomUUID(),
          name: 'any_name',
          password: await hash(table[0].password, 2)
        },
        settings: {
          accountActivated: table[0].accountActivated === 'true',
          currency: 'BRL',
          handicap: 1
        }
      })
    })

    given('I am logged out', () => {
      accessToken = ''
      refreshToken = ''
    })

    when('I request to login using the following credentials:', async (table) => {
      const query = loginMutation({ email: table[0].email, password: table[0].password })

      result = await request(app)
        .post(environment.GRAPHQL.ENDPOINT)
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then(/^I should get a message "(.*)"$/, (message) => {
      expect(result.body.data.login.message).toBe(message)
    })

    and(/^I must receive a status code of (.*)$/, (statusCode) => {
      expect(result.status).toBe(parseInt(statusCode))
    })
  })

  test('i should not login if I use invalid credentials', ({ given, when, then, and }) => {
    given('I have an account with the following credentials:', async (table) => {
      fakeUser = await userHelper.insertUser(userCollection, {
        personal: {
          email: table[0].email,
          id: randomUUID(),
          name: 'any_name',
          password: await hash(table[0].password, 2)
        },
        settings: {
          accountActivated: table[0].accountActivated === 'true',
          currency: 'BRL',
          handicap: 1
        }
      })
    })

    given('I am logged out', () => {
      accessToken = ''
      refreshToken = ''
    })

    when('I request to login using the following credentials:', async (table) => {
      const query = loginMutation({ email: table[0].email, password: table[0].password })

      result = await request(app)
        .post(environment.GRAPHQL.ENDPOINT)
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then(/^I should get an error with message "(.*)"$/, (message) => {
      expect(result.body.errors[0].message).toBe(message)
    })

    and(/^I must receive a status code of (.*)$/, (statusCode) => {
      expect(result.status).toBe(parseInt(statusCode))
    })
  })
})
