import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'

import { setupApp } from '@/main/express/config/app'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'

import { createTaskMutation } from '@/tests/helpers/queries'

import { Express } from 'express'
import { loadFeature, defineFeature } from 'jest-cucumber'
import MockDate from 'mockdate'
import path from 'path'
import request from 'supertest'

const feature = loadFeature(path.resolve(__dirname, 'create-task.feature'))

defineFeature(feature, (test) => {
  const client = makeMongoDb()
  let accessToken: string
  let app: Express
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

    when('I try to create a new task with the following data:', async (table) => {
      const query = createTaskMutation({ ...table[0], date: new Date(Date.parse(table[0].date)) })

      result = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then(/^I should receive an error with message "(.*)"$/, (message) => {
      expect(result.body.errors[0].message).toBe(message)
    })

    and(/^I must receive a status code of (.*)$/, (statusCode) => {
      expect(result.status).toBe(parseInt(statusCode))
    })
  })
})
