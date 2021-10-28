import { IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'

import { setupApp } from '@/main/express/config/app'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'

import { activateAccountMutation } from '@/tests/helpers/queries'
import { userHelper } from '@/tests/helpers/user-helper'

import { randomUUID } from 'crypto'
import { Express } from 'express'
import { loadFeature, defineFeature } from 'jest-cucumber'
import path from 'path'
import request from 'supertest'

const feature = loadFeature(path.resolve(__dirname, 'activate-account.feature'))

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

  test('being not partially logged in', ({ given, when, then, and }) => {
    expect.hasAssertions()

    given('I have an account with the following credentials:', async (table) => {
      fakeUser = await userHelper.insertUser(userCollection, {
        personal: {
          email: table[0].email,
          id: randomUUID(),
          name: 'any_name',
          password: 'any_password'
        },
        temporary: {
          activationCode: table[0].activationCode,
          activationCodeExpiration: new Date(Date.now() + 1000 * 60 * 10)
        }
      })
    })

    given('I am not partially logged in', () => {
      accessToken = ''
      refreshToken = ''
    })

    when('I request to activate my account using the following credentials:', async (table) => {
      const query = activateAccountMutation({ activationCode: table[0].activationCode, email: table[0].email })

      result = await request(app)
        .post('/graphql')
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

  test('using a valid activation code', ({ given, when, then, and }) => {
    expect.hasAssertions()

    given('I have an account with the following credentials:', async (table) => {
      fakeUser = await userHelper.insertUser(userCollection, {
        personal: {
          email: table[0].email,
          id: randomUUID(),
          name: 'any_name',
          password: 'any_password'
        },
        temporary: {
          activationCode: table[0].activationCode,
          activationCodeExpiration: new Date(Date.now() + 1000 * 60 * 10)
        }
      })
    })

    given('I am partially logged in', async () => {
      ;[accessToken, refreshToken = ''] = await userHelper.generateToken(fakeUser)
    })

    when('I request to activate my account using the following credentials:', async (table) => {
      const query = activateAccountMutation({ activationCode: table[0].activationCode, email: table[0].email })

      result = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then('I should have my account activated', async () => {
      const user = (await userCollection.findOne({ 'personal.id': fakeUser.personal.id })) as IUser

      expect(user.temporary.activationCode).toBeNull()
      expect(user.temporary.activationCodeExpiration).toBeNull()
    })

    and(/^I must receive a status code of (.*)$/, (statusCode) => {
      expect(result.status).toBe(parseInt(statusCode))
    })
  })

  test('using an invalid activation code', ({ given, when, then, and }) => {
    expect.hasAssertions()

    given('I have an account with the following credentials:', async (table) => {
      fakeUser = await userHelper.insertUser(userCollection, {
        personal: {
          email: table[0].email,
          id: randomUUID(),
          name: 'any_name',
          password: 'any_password'
        },
        temporary: {
          activationCode: table[0].activationCode,
          activationCodeExpiration: new Date(Date.now() + 1000 * 60 * 10)
        }
      })
    })

    given('I am partially logged in', async () => {
      ;[accessToken, refreshToken = ''] = await userHelper.generateToken(fakeUser)
    })

    when('I request to activate my account using the following credentials:', async (table) => {
      const query = activateAccountMutation({ activationCode: table[0].activationCode, email: table[0].email })

      result = await request(app)
        .post('/graphql')
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
