import { IUser } from '@/domain'
import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'
import { environment } from '@/main/config/environment'
import App from '@/main/express/config/app'
import { makeMongoDb } from '@/main/factories/database/mongo-db-factory'
import { userHelper } from '@/tests/helpers/user-helper'
import { logoutMutation } from './logout-document'
import { Express } from 'express'
import { defineFeature, loadFeature } from 'jest-cucumber'
import { resolve } from 'path'
import request from 'supertest'

const feature = loadFeature(resolve(__dirname, 'logout.feature'))

defineFeature(feature, (test) => {
  const client = makeMongoDb()
  let accessToken: string
  let app: Express
  let dbIsConnected = true
  let fakeUser: IUser
  let refreshToken: string
  let userCollection: ICollectionMethods
  let result: request.Response

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

    when('I request to logout', async () => {
      const query = logoutMutation()

      result = await request(app)
        .post(environment.GRAPHQL.ENDPOINT)
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then(/^I should see a message "(.*)"$/, (message) => {
      expect(result.body.data.logout.message).toBe(message)
    })

    and('I should have my tokenVersion incremented by 1', async () => {
      const user = (await userCollection.findOne({ 'personal.id': fakeUser.personal.id })) as IUser

      expect(user.tokenVersion).toBe(2)
    })

    and(/^I must receive a status code of (\d+)$/, (statusCode) => {
      expect(result.statusCode).toBe(+statusCode)
    })
  })

  test('being logged out', ({ given, when, then, and }) => {
    given('I am logged out', async () => {
      accessToken = ''
      refreshToken = ''
    })

    when('I request to logout', async () => {
      const query = logoutMutation()

      result = await request(app)
        .post(environment.GRAPHQL.ENDPOINT)
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
})
