import { IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'

import { environment } from '@/main/config/environment'
import App from '@/main/express/config/app'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'

import { taskHelper } from '@/tests/helpers/task-helper.ts'
import { userHelper } from '@/tests/helpers/user-helper'

import { createTaskMutation } from './create-task-document'

import { Express } from 'express'
import { loadFeature, defineFeature } from 'jest-cucumber'
import MockDate from 'mockdate'
import { resolve } from 'path'
import request from 'supertest'

const feature = loadFeature(resolve(__dirname, 'create-task.feature'))

defineFeature(feature, (test) => {
  const client = makeMongoDb()
  let accessToken: string
  let dbIsConnected = true
  let app: Express
  let fakeUser: IUser
  let refreshToken: string
  let result: any
  let taskCollection: ICollectionMethods
  let userCollection: ICollectionMethods

  afterAll(async () => {
    if (!dbIsConnected) await client.disconnect()

    MockDate.reset()
  })

  afterEach(async () => {
    await userCollection.deleteMany({})
  })

  beforeAll(async () => {
    dbIsConnected = MongoAdapter.client !== null
    if (!dbIsConnected) await MongoAdapter.connect(global.__MONGO_URI__)

    MockDate.set(new Date())

    app = await App.setup()

    taskCollection = client.collection('tasks')
    userCollection = client.collection('users')
  })

  test('being logged out', ({ given, when, then, and }) => {
    given('I am logged out', () => {
      accessToken = ''
      refreshToken = ''
    })

    when('I try to create a new task with the following data:', async (table) => {
      const query = createTaskMutation({ ...table[0], date: new Date(Date.parse(table[0].date)) })

      result = await request(app)
        .post(environment.GRAPHQL.ENDPOINT)
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

  test('using an existent task id', ({ given, when, then, and }) => {
    given('I am logged in', async () => {
      fakeUser = await userHelper.insertUser(userCollection)
      ;[accessToken, refreshToken] = await userHelper.generateToken(fakeUser)
    })

    given(/^I already have a task with taskId of (.*)$/, async (taskId) => {
      await taskHelper.insertTask(taskCollection, fakeUser, { taskId })
    })

    when('I try to create a new task with the following data:', async (table) => {
      const query = createTaskMutation({ ...table[0], date: new Date(Date.parse(table[0].date)) })

      result = await request(app)
        .post(environment.GRAPHQL.ENDPOINT)
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

  test('using an invalid input', ({ given, when, then, and }) => {
    given('I am logged in', async () => {
      fakeUser = await userHelper.insertUser(userCollection)
      ;[accessToken, refreshToken] = await userHelper.generateToken(fakeUser)
    })

    when(
      /^I try to create a new task with the following invalid data (.*) (.*) (.*) (.*) (.*) (.*)$/,
      async (commentary, date, duration, status, taskId, type) => {
        const query = createTaskMutation({
          commentary,
          date: new Date(Date.parse(date)),
          duration,
          status,
          taskId,
          type
        })

        result = await request(app)
          .post(environment.GRAPHQL.ENDPOINT)
          .set('x-access-token', accessToken)
          .set('x-refresh-token', refreshToken)
          .send({ query })
      }
    )

    then('I should receive an error with message of invalid param', () => {
      expect(result.body.errors[0].message.startsWith('Invalid param:')).toBeTruthy()
    })

    and(/^I must receive a status code of (.*)$/, (statusCode) => {
      expect(result.status).toBe(parseInt(statusCode))
    })
  })

  test('Using a valid input', ({ given, when, then, and }) => {
    given('I am logged in', async () => {
      fakeUser = await userHelper.insertUser(userCollection)
      ;[accessToken, refreshToken] = await userHelper.generateToken(fakeUser)
    })

    when(
      /^I try to create a new task with the following valid data (.*) (.*) (.*) (.*) (.*) (.*)$/,
      async (commentary, date, duration, status, taskId, type) => {
        const query = createTaskMutation({
          commentary,
          date: new Date(Date.parse(date)),
          duration,
          status,
          taskId,
          type
        })

        result = await request(app)
          .post(environment.GRAPHQL.ENDPOINT)
          .set('x-access-token', accessToken)
          .set('x-refresh-token', refreshToken)
          .send({ query })
      }
    )

    then('I should have created a new task', () => {
      expect(result.body.data.createTask.task).toBeTruthy()
    })

    and(/^I must receive a status code of (.*)$/, (statusCode) => {
      expect(result.status).toBe(parseInt(statusCode))
    })
  })
})
