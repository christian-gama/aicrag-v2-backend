import { ITask, IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'

import { environment } from '@/main/config/environment'
import App from '@/main/express/config/app'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'

import { taskHelper } from '@/tests/helpers/task-helper.ts'
import { userHelper } from '@/tests/helpers/user-helper'

import { findOneTaskQuery } from './find-one-task-document'

import { Express } from 'express'
import { loadFeature, defineFeature } from 'jest-cucumber'
import MockDate from 'mockdate'
import { resolve } from 'path'
import request from 'supertest'

const feature = loadFeature(resolve(__dirname, 'find-one-task.feature'))

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

    when('I try to find one task', async () => {
      const query = findOneTaskQuery({ id: '70d40f38-55d5-43d9-acce-834e161c5c1c' })

      result = await request(app)
        .post(environment.GRAPHQL.ENDPOINT)
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then(/^I should receive an error with message "(.*)"$/, async (message) => {
      expect(result.body.errors[0].message).toBe(message)
    })

    and(/^I must receive a status code of (\d+)$/, (statusCode) => {
      expect(result.status).toBe(parseInt(statusCode))
    })
  })

  test('Having an existent task', ({ given, when, then, and }) => {
    given(/^I have a task of id "(.*)"$/, async (id) => {
      fakeUser = await userHelper.insertUser(userCollection)
      fakeTask = await taskHelper.insertTask(taskCollection, fakeUser, { id })
    })

    given('I am logged in', async () => {
      ;[accessToken, refreshToken] = await userHelper.generateToken(fakeUser)
    })

    when(/^I try to find one task using the id "(.*)"$/, async (id) => {
      const query = findOneTaskQuery({ id })

      result = await request(app)
        .post(environment.GRAPHQL.ENDPOINT)
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then('I should get the task', () => {
      expect(result.body.data.findOneTask.task.id).toBe(fakeTask.id)
    })

    and(/^I must receive a status code of (\d+)$/, (statusCode) => {
      expect(result.status).toBe(parseInt(statusCode))
    })
  })

  test('Task does not exist', ({ given, when, then, and }) => {
    given(/^I have a task of id "(.*)"$/, async (id) => {
      fakeUser = await userHelper.insertUser(userCollection)
      fakeTask = await taskHelper.insertTask(taskCollection, fakeUser)
    })

    given('I am logged in', async () => {
      ;[accessToken, refreshToken] = await userHelper.generateToken(fakeUser)
    })

    when(/^I try to find one task using a non-existent id "(.*)"$/, async (id) => {
      const query = findOneTaskQuery({ id })

      result = await request(app)
        .post(environment.GRAPHQL.ENDPOINT)
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then(/^I should receive an error message "(.*)"$/, (message) => {
      expect(result.body.errors[0].message).toBe(message)
    })

    and(/^I must receive a status code of (\d+)$/, (statusCode) => {
      expect(result.status).toBe(parseInt(statusCode))
    })
  })
})
