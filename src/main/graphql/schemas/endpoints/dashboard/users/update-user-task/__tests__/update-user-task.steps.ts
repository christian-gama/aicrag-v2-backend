import { ITask, IUser, IUserRole } from '@/domain'
import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'
import { environment } from '@/main/config/environment'
import App from '@/main/express/config/app'
import { makeMongoDb } from '@/main/factories/database/mongo-db-factory'
import { taskHelper } from '@/tests/helpers/task-helper.ts'
import { userHelper } from '@/tests/helpers/user-helper'
import { updateUserTaskMutation } from './update-user-task-document'
import { randomUUID } from 'crypto'
import { Express } from 'express'
import { loadFeature, defineFeature } from 'jest-cucumber'
import MockDate from 'mockdate'
import { resolve } from 'path'
import request from 'supertest'

const feature = loadFeature(resolve(__dirname, 'update-user-task.feature'))

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
      const query = updateUserTaskMutation({ id: randomUUID() }, {})

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

  test('Being a common user', ({ given, when, then, and }) => {
    given('I am a common user', async () => {
      fakeUser = await userHelper.insertUser(userCollection, { settings: { role: IUserRole.user } })
    })

    given('I am logged in', async () => {
      ;[accessToken, refreshToken] = await userHelper.generateToken(fakeUser)
    })

    when('I try to update a task', async () => {
      const query = updateUserTaskMutation({ id: randomUUID() }, {})

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

  test('Using an existent task id', ({ given, when, then, and }) => {
    given('I am an administrator', async () => {
      fakeUser = await userHelper.insertUser(userCollection, {
        settings: { currency: 'BRL', handicap: 1, role: IUserRole.administrator }
      })
    })

    given('I am logged in', async () => {
      ;[accessToken, refreshToken] = await userHelper.generateToken(fakeUser)
    })

    given(/^I already have a task with taskId of (\d+)$/, async (taskId) => {
      await taskHelper.insertTask(taskCollection, fakeUser, { taskId })
      fakeTask = await taskHelper.insertTask(taskCollection, fakeUser)
    })

    when('I try to update a new task with the following data:', async (table) => {
      const query = updateUserTaskMutation({ id: fakeTask.id }, { ...table[0] })

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

  test('Using an invalid input', ({ given, when, then, and }) => {
    given('I am an administrator', async () => {
      fakeUser = await userHelper.insertUser(userCollection, {
        settings: { currency: 'BRL', handicap: 1, role: IUserRole.administrator }
      })
    })

    given(/^I have a task with ID of "(.*)"$/, async (id) => {
      fakeTask = await taskHelper.insertTask(taskCollection, fakeUser, { id })
    })

    given('I am logged in', async () => {
      ;[accessToken, refreshToken] = await userHelper.generateToken(fakeUser)
    })

    when(
      /^I try to update a new task of id "(.*)" with the following invalid data (.*) (.*) (.*) (.*) (.*) (.*)$/,
      async (id, commentary, date, duration, status, taskId, type) => {
        const query = updateUserTaskMutation({ id }, { commentary, date, duration, status, taskId, type })

        result = await request(app)
          .post(environment.GRAPHQL.ENDPOINT)
          .set('x-access-token', accessToken)
          .set('x-refresh-token', refreshToken)
          .send({ query })
      }
    )

    then('I should receive an error with message of invalid param', () => {
      expect(result.body.errors[0].message.startsWith('Parâmetro inválido:')).toBeTruthy()
    })

    and(/^I must receive a status code of (\d+)$/, (statusCode) => {
      expect(result.status).toBe(parseInt(statusCode))
    })
  })

  test('Using a valid input', ({ given, when, then, and }) => {
    given('I am an administrator', async () => {
      fakeUser = await userHelper.insertUser(userCollection, {
        settings: { currency: 'BRL', handicap: 1, role: IUserRole.administrator }
      })
    })

    given(/^I have a task with ID of "(.*)"$/, async (id) => {
      fakeTask = await taskHelper.insertTask(taskCollection, fakeUser, { id })
    })

    given('I am logged in', async () => {
      ;[accessToken, refreshToken] = await userHelper.generateToken(fakeUser)
    })

    when(
      /^I try to update a new task of id "(.*)" with the following valid data (.*) (.*) (.*) (.*) (.*) (.*)$/,
      async (id, commentary, date, duration, status, taskId, type) => {
        const query = updateUserTaskMutation({ id }, { commentary, date, duration, status, taskId, type })

        result = await request(app)
          .post(environment.GRAPHQL.ENDPOINT)
          .set('x-access-token', accessToken)
          .set('x-refresh-token', refreshToken)
          .send({ query })
      }
    )

    then('I should have updated my task', () => {
      expect(result.body.data.updateUserTask.task.id).toBe(fakeTask.id)
    })

    and(/^I must receive a status code of (\d+)$/, (statusCode) => {
      expect(result.status).toBe(parseInt(statusCode))
    })
  })
})
