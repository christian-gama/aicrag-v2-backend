import { ITask, IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'

import { environment } from '@/main/config/environment'
import App from '@/main/express/config/app'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'

import { updateTaskMutation } from '@/tests/helpers/queries'
import { taskHelper } from '@/tests/helpers/task-helper.ts'
import { userHelper } from '@/tests/helpers/user-helper'

import { Express } from 'express'
import { loadFeature, defineFeature } from 'jest-cucumber'
import MockDate from 'mockdate'
import path from 'path'
import request from 'supertest'

const feature = loadFeature(path.resolve(__dirname, 'update-task.feature'))

defineFeature(feature, (test) => {
  const client = makeMongoDb()
  let accessToken: string
  let dbIsConnected = true
  let app: Express
  let fakeTask: ITask
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
    await taskCollection.deleteMany({})
  })

  beforeAll(async () => {
    dbIsConnected = MongoAdapter.client !== null
    if (!dbIsConnected) await MongoAdapter.connect(global.__MONGO_URI__)

    MockDate.set(new Date())

    app = await App.setup()

    taskCollection = client.collection('tasks')
    userCollection = client.collection('users')
  })

  test('Being logged out', ({ given, when, then, and }) => {
    given('I am logged out', () => {
      accessToken = ''
      refreshToken = ''
    })

    when('I try to update a task', async () => {
      const query = updateTaskMutation({ id: '0f4c53c1-f801-47f8-97b4-62d204764bb1' }, {})

      result = await request(app)
        .post(environment.GRAPHQL.ENDPOINT)
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then(/^I should receive an error with message "(.*)"$/, (message) => {
      expect(result.body.errors[0].message).toBe(message)
    })

    and(/^I must receive a status code of (\d+)$/, (statusCode) => {
      expect(result.status).toBe(parseInt(statusCode))
    })
  })

  test('Using an existent task id', ({ given, when, then, and }) => {
    given('I am logged in', async () => {
      fakeUser = await userHelper.insertUser(userCollection)
      ;[accessToken, refreshToken] = await userHelper.generateToken(fakeUser)
    })

    given(/^I already have a task with taskId of (\d+)$/, async (taskId) => {
      await taskHelper.insertTask(taskCollection, fakeUser, { taskId })
      fakeTask = await taskHelper.insertTask(taskCollection, fakeUser)
    })

    when('I try to update a new task with the following data:', async (table) => {
      const query = updateTaskMutation({ id: fakeTask.id }, { ...table[0] })

      result = await request(app)
        .post(environment.GRAPHQL.ENDPOINT)
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then(/^I should receive an error with message "(.*)"$/, (message) => {
      console.log(result.body)
      expect(result.body.errors[0].message).toBe(message)
    })

    and(/^I must receive a status code of (\d+)$/, (statusCode) => {
      expect(result.status).toBe(parseInt(statusCode))
    })
  })

  test('Using an invalid input', ({ given, when, then, and }) => {
    given(/^I have a task with ID of "(.*)"$/, async (id) => {
      fakeUser = await userHelper.insertUser(userCollection)
      fakeTask = await taskHelper.insertTask(taskCollection, fakeUser, { id })
    })

    given('I am logged in', async () => {
      ;[accessToken, refreshToken] = await userHelper.generateToken(fakeUser)
    })

    when(
      /^I try to update a new task of id "(.*)" with the following invalid data (.*) (.*) (.*) (.*) (.*) (.*)$/,
      async (id, commentary, date, duration, status, taskId, type) => {
        const query = updateTaskMutation({ id }, { commentary, date, duration, status, taskId, type })

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

    and(/^I must receive a status code of (\d+)$/, (statusCode) => {
      expect(result.status).toBe(parseInt(statusCode))
    })
  })

  test('Using a valid input', ({ given, when, then, and }) => {
    given(/^I have a task with ID of "(.*)"$/, async (id) => {
      fakeUser = await userHelper.insertUser(userCollection)
      fakeTask = await taskHelper.insertTask(taskCollection, fakeUser, { id })
    })

    given('I am logged in', async () => {
      ;[accessToken, refreshToken] = await userHelper.generateToken(fakeUser)
    })

    when(
      /^I try to update a new task of id "(.*)" with the following valid data (.*) (.*) (.*) (.*) (.*) (.*)$/,
      async (id, commentary, date, duration, status, taskId, type) => {
        const query = updateTaskMutation({ id }, { commentary, date, duration, status, taskId, type })

        result = await request(app)
          .post(environment.GRAPHQL.ENDPOINT)
          .set('x-access-token', accessToken)
          .set('x-refresh-token', refreshToken)
          .send({ query })
      }
    )

    then('I should have updated my task', () => {
      console.log(result.body)
      expect(result.body.data.updateTask.task.id).toBe(fakeTask.id)
    })

    and(/^I must receive a status code of (\d+)$/, (statusCode) => {
      expect(result.status).toBe(parseInt(statusCode))
    })
  })
})
