import { IUser } from '@/domain'
import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'
import { environment } from '@/main/config/environment'
import App from '@/main/express/config/app'
import { makeMongoDb } from '@/main/factories/database/mongo-db-factory'
import { taskHelper } from '@/tests/helpers/task-helper.ts'
import { userHelper } from '@/tests/helpers/user-helper'
import { deleteTaskMutation } from './delete-task-document'
import { Express } from 'express'
import { loadFeature, defineFeature } from 'jest-cucumber'
import MockDate from 'mockdate'
import { resolve } from 'path'
import request from 'supertest'

const feature = loadFeature(resolve(__dirname, 'delete-task.feature'))

defineFeature(feature, (test) => {
  const client = makeMongoDb()
  let accessToken: string
  let app: Express
  let dbIsConnected = true
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
    given(/^I have an existent task with the id "(.*)"$/, async (id) => {
      fakeUser = await userHelper.insertUser(userCollection)
      await taskHelper.insertTask(taskCollection, fakeUser, { id })
    })

    given('I am logged out', () => {
      accessToken = ''
      refreshToken = ''
    })

    when(/^I try to delete a task with the id "(.*)":$/, async (id) => {
      const query = deleteTaskMutation({ id })

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

  test('using an invalid ID', ({ given, when, then, and }) => {
    given(/^I have an existent task with the id "(.*)"$/, async (id) => {
      fakeUser = await userHelper.insertUser(userCollection)
      await taskHelper.insertTask(taskCollection, fakeUser, { id })
    })

    given('I am logged in', async () => {
      ;[accessToken, refreshToken] = await userHelper.generateToken(fakeUser)
    })

    when(/^I try to delete a task with the id "(.*)":$/, async (id) => {
      const query = deleteTaskMutation({ id })

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

  test('using a valid ID', ({ given, when, then, and }) => {
    given(/^I have an existent task with the id "(.*)"$/, async (id) => {
      fakeUser = await userHelper.insertUser(userCollection)
      await taskHelper.insertTask(taskCollection, fakeUser, { id })
    })

    given('I am logged in', async () => {
      ;[accessToken, refreshToken] = await userHelper.generateToken(fakeUser)
    })

    when(/^I try to delete a task with the id "(.*)":$/, async (id) => {
      const query = deleteTaskMutation({ id })

      result = await request(app)
        .post(environment.GRAPHQL.ENDPOINT)
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then(/^I should receive success message "(.*)"$/, (message) => {
      expect(result.body.data.deleteTask.message).toEqual(message)
    })

    and(/^I must receive a status code of (\d+)$/, (statusCode) => {
      expect(result.status).toEqual(parseInt(statusCode))
    })
  })
})
