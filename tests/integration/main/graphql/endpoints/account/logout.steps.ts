import { IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'

import { setupApp } from '@/main/express/config/app'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import { makeGenerateAccessToken, makeGenerateRefreshToken } from '@/factories/providers/token'

import { makeFakeUser } from '@/tests/__mocks__'

import { Express } from 'express'
import { defineFeature, loadFeature } from 'jest-cucumber'
import path from 'path'
import request from 'supertest'

let app: Express

const feature = loadFeature(path.resolve(__dirname, 'logout.feature'))

defineFeature(feature, (test) => {
  const client = makeMongoDb()
  let accessToken: string
  let fakeUser: IUser
  let refreshToken: string
  let userCollection: ICollectionMethods
  let query: string
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

  beforeEach(async () => {
    query = `
      mutation {
        logout {
            message
        }
      }
    `
  })

  test('requesting to logout being logged in', ({ given, when, then, and }) => {
    expect.hasAssertions()

    given('I am logged in', async () => {
      fakeUser = makeFakeUser()
      await userCollection.insertOne(fakeUser)
      accessToken = makeGenerateAccessToken().generate(fakeUser)
      refreshToken = await makeGenerateRefreshToken().generate(fakeUser)
    })

    when('I request to logout', async () => {
      response = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then(/^I should see a message that I says "You've been logged out"$/, () => {
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
      fakeUser = makeFakeUser()
      await userCollection.insertOne(fakeUser)
      accessToken = ''
      refreshToken = ''
    })

    when('I request to logout', async () => {
      response = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then(/^I should see an error that contains the "Token is missing"$/, () => {
      expect(response.body.errors[0].message).toBe('Token is missing')
    })

    and('I must receive a status code of 401', async () => {
      expect(response.statusCode).toBe(401)
    })
  })
})
