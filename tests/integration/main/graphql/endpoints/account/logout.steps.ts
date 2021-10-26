import { IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'

import { setupApp } from '@/main/express/config/app'
import { logoutMutation } from '@/main/graphql/queries/mutations/logout'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'

import { userHelper } from '@/tests/helpers/user-helper'

import { Express } from 'express'
import { defineFeature, loadFeature } from 'jest-cucumber'
import path from 'path'
import request from 'supertest'

const feature = loadFeature(path.resolve(__dirname, 'logout.feature'))

defineFeature(feature, (test) => {
  const client = makeMongoDb()
  let accessToken: string
  let app: Express
  let fakeUser: IUser
  let refreshToken: string
  let userCollection: ICollectionMethods
  let response: request.Response

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

  test('requesting to logout being logged in', ({ given, when, then, and }) => {
    expect.hasAssertions()

    given('I am logged in', async () => {
      fakeUser = await userHelper.create(userCollection)
      ;[accessToken, refreshToken] = await userHelper.login(fakeUser)
    })

    when('I request to logout', async () => {
      const query = logoutMutation()

      response = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then(/^I should see a message "You've been logged out"$/, () => {
      expect(response.body.data.logout.message).toBe("You've been logged out")
    })

    and('I should have my tokenVersion incremented by 1', async () => {
      const user = (await userCollection.findOne({ 'personal.id': fakeUser.personal.id })) as IUser

      expect(user.tokenVersion).toBe(2)
    })

    and('I must receive a status code of 200', async () => {
      expect(response.statusCode).toBe(200)
    })
  })

  test('requesting to logout being logged out', ({ given, when, then, and }) => {
    expect.hasAssertions()

    given('I am logged out', async () => {
      accessToken = ''
      refreshToken = ''
    })

    when('I request to logout', async () => {
      const query = logoutMutation()

      response = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then(/^I should see an error that contains a message "Token is missing"$/, () => {
      expect(response.body.errors[0].message).toBe('Token is missing')
    })

    and('I must receive a status code of 401', async () => {
      expect(response.statusCode).toBe(401)
    })
  })
})
