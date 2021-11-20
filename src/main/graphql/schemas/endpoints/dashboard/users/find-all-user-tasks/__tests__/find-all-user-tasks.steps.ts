import { ITask, IUser, IUserRole } from '@/domain'
import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'
import { environment } from '@/main/config/environment'
import App from '@/main/express/config/app'
import { makeMongoDb } from '@/main/factories/database/mongo-db-factory'
import { taskHelper } from '@/tests/helpers/task-helper.ts'
import { userHelper } from '@/tests/helpers/user-helper'
import { findAllUserTasksQuery } from './find-all-user-tasks-document'
import { randomUUID } from 'crypto'
import { Express } from 'express'
import { loadFeature, defineFeature } from 'jest-cucumber'
import MockDate from 'mockdate'
import { resolve } from 'path'
import request from 'supertest'

const feature = loadFeature(resolve(__dirname, 'find-all-user-tasks.feature'))

defineFeature(feature, (test) => {
  const client = makeMongoDb()
  let accessToken: string
  let dbIsConnected = true
  let app: Express
  let fakeTask: ITask | ITask[]
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

    when('I try to find all tasks:', async () => {
      const query = findAllUserTasksQuery({ userId: randomUUID() }, {})

      result = await request(app)
        .post(environment.GRAPHQL.ENDPOINT)
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then(/^I should receive an error with message "(.*)"$/, (message) => {
      expect(result.body.errors[0].message).toEqual(message)
    })

    and(/^I must receive a status code of (\d+)$/, (statusCode) => {
      expect(result.status).toEqual(parseInt(statusCode))
    })
  })

  test('Being a common user', ({ given, when, then, and }) => {
    given('I am a common user', async () => {
      fakeUser = await userHelper.insertUser(userCollection, { settings: { role: IUserRole.user } })
    })

    given('I am logged in', async () => {
      ;[accessToken, refreshToken] = await userHelper.generateToken(fakeUser)
    })

    when('I try to find all tasks', async () => {
      const query = findAllUserTasksQuery({ userId: randomUUID() }, {})

      result = await request(app)
        .post(environment.GRAPHQL.ENDPOINT)
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then(/^I should receive an error with message "(.*)"$/, (message) => {
      expect(result.body.errors[0].message).toStrictEqual(message)
    })

    and(/^I must receive a status code of (.*)$/, (statusCode) => {
      expect(result.status).toEqual(parseInt(statusCode))
    })
  })

  test('having existent tasks', ({ given, when, then, and }) => {
    let taskOwner: IUser

    given('I have the following tasks:', async (table) => {
      fakeUser = await userHelper.insertUser(userCollection, { settings: { role: IUserRole.administrator } })
      taskOwner = await userHelper.insertUser(userCollection)
      fakeTask = await taskHelper.insertTasks(table, taskCollection, taskOwner)
    })

    given('I am logged in', async () => {
      ;[accessToken, refreshToken] = await userHelper.generateToken(fakeUser)
    })

    when('I try to find all tasks', async () => {
      const query = findAllUserTasksQuery({ userId: taskOwner.personal.id }, {})

      result = await request(app)
        .post(environment.GRAPHQL.ENDPOINT)
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then('I should get the following tasks:', (table) => {
      const allTasks = taskHelper.getTasks(table, fakeTask as ITask[], taskOwner)

      expect(result.body.data.findAllUserTasks).toStrictEqual({
        count: table.length,
        displaying: table.length,
        documents: allTasks,
        page: '1 of 1'
      })
    })

    and(/^I must receive a status code of (\d+)$/, (statusCode) => {
      expect(result.status).toEqual(parseInt(statusCode))
    })
  })

  test('getting all tasks using filters', ({ given, when, then, and }) => {
    let taskOwner: IUser

    given('I have the following tasks:', async (table) => {
      fakeUser = await userHelper.insertUser(userCollection, { settings: { role: IUserRole.administrator } })
      taskOwner = await userHelper.insertUser(userCollection)
      fakeTask = await taskHelper.insertTasks(table, taskCollection, taskOwner)
    })

    given('I am logged in', async () => {
      ;[accessToken, refreshToken] = await userHelper.generateToken(fakeUser)
    })

    when(/^I try to find all tasks limiting the results by "(.*)"$/, async (limit) => {
      const query = findAllUserTasksQuery({ userId: taskOwner.personal.id }, { limit })

      result = await request(app)
        .post(environment.GRAPHQL.ENDPOINT)
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then('I should get the following tasks:', (table) => {
      const allTasks = taskHelper.getTasks(table, fakeTask as ITask[], taskOwner)

      expect(result.body.data.findAllUserTasks.documents).toStrictEqual([allTasks[0]])
    })

    and(/^The displaying count should be "(.*)"$/, (displaying) => {
      expect(result.body.data.findAllUserTasks.displaying).toBe(+displaying)
    })

    and(/^The amount page should be "(.*)"$/, (page) => {
      expect(result.body.data.findAllUserTasks.page).toBe(page)
    })

    and(/^I must receive a status code of (\d+)$/, (statusCode) => {
      expect(result.status).toBe(parseInt(statusCode))
    })
  })
})
