import { IUser } from '@/domain'
import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'
import { environment } from '@/main/config/environment'
import App from '@/main/express/config/app'
import { makeMongoDb } from '@/main/factories/database/mongo-db-factory'
import { userHelper } from '@/tests/helpers/user-helper'
import { activateAccountMutation } from './activate-account-document'
import { Express } from 'express'
import { loadFeature, defineFeature } from 'jest-cucumber'
import { resolve } from 'path'
import request from 'supertest'

const feature = loadFeature(resolve(__dirname, 'activate-account.feature'))

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

  test('being not partially logged in', ({ given, when, then, and }) => {
    given('I have an account with the following credentials:', async (table) => {
      fakeUser = await userHelper.insertUser(userCollection, {
        personal: {
          email: 'any@email.com',
          id: table[0].userId,
          name: 'any_name',
          password: 'any_password'
        },
        temporary: {
          activationPin: table[0].activationPin,
          activationPinExpiration: new Date(Date.now() + 1000 * 60 * 10)
        }
      })
    })

    given('I am not partially logged in', () => {
      accessToken = ''
      refreshToken = ''
    })

    when('I request to activate my account using the following credentials:', async (table) => {
      const query = activateAccountMutation({ activationPin: table[0].activationPin, userId: table[0].userId })

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

  test('using a valid activation pin', ({ given, when, then, and }) => {
    given('I have an account with the following credentials:', async (table) => {
      fakeUser = await userHelper.insertUser(userCollection, {
        personal: {
          email: 'any@email.com',
          id: table[0].userId,
          name: 'any_name',
          password: 'any_password'
        },
        temporary: {
          activationPin: table[0].activationPin,
          activationPinExpiration: new Date(Date.now() + 1000 * 60 * 10)
        }
      })
    })

    given('I am partially logged in', async () => {
      ;[accessToken, refreshToken = ''] = await userHelper.generateToken(fakeUser)
    })

    when('I request to activate my account using the following credentials:', async (table) => {
      const query = activateAccountMutation({ activationPin: table[0].activationPin, userId: table[0].userId })

      result = await request(app)
        .post(environment.GRAPHQL.ENDPOINT)
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then('I should have my account activated', async () => {
      const user = (await userCollection.findOne({ 'personal.id': fakeUser.personal.id })) as IUser

      expect(user.temporary.activationPin).toBeNull()
      expect(user.temporary.activationPinExpiration).toBeNull()
    })

    and(/^I must receive a status code of (.*)$/, (statusCode) => {
      expect(result.status).toBe(parseInt(statusCode))
    })
  })

  test('using an invalid activation pin', ({ given, when, then, and }) => {
    given('I have an account with the following credentials:', async (table) => {
      fakeUser = await userHelper.insertUser(userCollection, {
        personal: {
          email: 'any@email.com',
          id: table[0].userId,
          name: 'any_name',
          password: 'any_password'
        },
        temporary: {
          activationPin: table[0].activationPin,
          activationPinExpiration: new Date(Date.now() + 1000 * 60 * 10)
        }
      })
    })

    given('I am partially logged in', async () => {
      ;[accessToken, refreshToken = ''] = await userHelper.generateToken(fakeUser)
    })

    when('I request to activate my account using the following credentials:', async (table) => {
      const query = activateAccountMutation({ activationPin: table[0].activationPin, userId: table[0].userId })

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
