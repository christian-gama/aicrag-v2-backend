import { IUser, IUserRole } from '@/domain'
import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'
import { environment } from '@/main/config/environment'
import App from '@/main/express/config/app'
import { makeMongoDb } from '@/main/factories/database/mongo-db-factory'
import { userHelper } from '@/tests/helpers/user-helper'
import { findAllUsersQuery } from './find-all-users-document'
import { Express } from 'express'
import { loadFeature, defineFeature } from 'jest-cucumber'
import { resolve } from 'path'
import request from 'supertest'

const feature = loadFeature(resolve(__dirname, 'find-all-users.feature'))

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

  test('Being logged out', ({ given, when, then, and }) => {
    given('I am logged out', () => {
      accessToken = ''
      refreshToken = ''
    })

    when('I request to get all users', async () => {
      const query = findAllUsersQuery({})

      result = await request(app)
        .post(environment.GRAPHQL.ENDPOINT)
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then(/^I should receive an error with message "(.*)"$/, (message) => {
      expect(result.body.errors[0].message).toEqual(message)
    })

    and(/^I must receive a status code of (.*)$/, (statusCode) => {
      expect(result.status).toEqual(parseInt(statusCode))
    })
  })

  test('Being a common user', ({ given, when, then, and }) => {
    given('I am logged in as a common user', async () => {
      fakeUser = await userHelper.insertUser(userCollection, { settings: { role: IUserRole.user } })
      ;[accessToken, refreshToken] = await userHelper.generateToken(fakeUser)
    })

    when('I request to get all users', async () => {
      const query = findAllUsersQuery({})

      result = await request(app)
        .post(environment.GRAPHQL.ENDPOINT)
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then(/^I should receive an error with message "(.*)"$/, (message) => {
      expect(result.body.errors[0].message).toEqual(message)
    })

    and(/^I must receive a status code of (.*)$/, (statusCode) => {
      expect(result.status).toEqual(parseInt(statusCode))
    })
  })

  test('Being an administrator', ({ given, when, then, and }) => {
    given('I am logged in as an administrator', async () => {
      fakeUser = await userHelper.insertUser(userCollection, { settings: { role: IUserRole.administrator } })
      ;[accessToken, refreshToken] = await userHelper.generateToken(fakeUser)
    })

    given('My database contain users with existent tasks', async () => {
      fakeUser = await userHelper.insertUser(userCollection)
      fakeUser = await userHelper.insertUser(userCollection)
      fakeUser = await userHelper.insertUser(userCollection)
    })

    when('I request to get all users', async () => {
      const query = findAllUsersQuery({ role: 'user' })

      result = await request(app)
        .post(environment.GRAPHQL.ENDPOINT)
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then('I should receive a list of users including their tasks', () => {
      expect(result.body.data.findAllUsers.documents.length).toBe(3)
    })

    and(/^I must receive a status code of (.*)$/, (statusCode) => {
      expect(result.status).toEqual(parseInt(statusCode))
    })
  })
})
