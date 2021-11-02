import { IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'

import { environment } from '@/main/config/environment'
import App from '@/main/express/config/app'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'

import { taskHelper } from '@/tests/helpers/task-helper.ts'
import { userHelper } from '@/tests/helpers/user-helper'

import { getAllInvoicesQuery } from './get-all-invoices-document'

import { Express } from 'express'
import { loadFeature, defineFeature } from 'jest-cucumber'
import MockDate from 'mockdate'
import { resolve } from 'path'
import request from 'supertest'

const feature = loadFeature(resolve(__dirname, 'get-all-invoices.feature'))

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

    userCollection = client.collection('users')
    taskCollection = client.collection('tasks')
  })

  test('being logged out', ({ given, when, then, and }) => {
    given('I am logged out', () => {
      accessToken = ''
      refreshToken = ''
    })

    when(/^I request to get all invoices of type "(.*)"$/, async (type) => {
      const query = getAllInvoicesQuery({ type })

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

  test('having invoices from different months', ({ given, when, then, and }) => {
    given('I am logged in', async () => {
      fakeUser = await userHelper.insertUser(userCollection)
      ;[accessToken, refreshToken] = await userHelper.generateToken(fakeUser)
    })

    given('I have the following tasks:', async (table) => {
      await taskHelper.insertTasks(table, taskCollection, fakeUser)
    })

    when(/^I request to get all invoices of type "(.*)"$/, async (type) => {
      const query = getAllInvoicesQuery({ type })

      result = await request(app)
        .post(environment.GRAPHQL.ENDPOINT)
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then('I should get the following invoices:', (table) => {
      const invoice = table.map((row) => ({
        date: { month: +row.month, year: +row.year },
        tasks: +row.tasks,
        totalUsd: +row.totalUsd
      }))

      expect(result.body.data.getAllInvoices).toStrictEqual({
        count: table.length,
        displaying: table.length,
        documents: invoice,
        page: '1 of 1'
      })
    })

    and(/^I must receive a status code of (.*)$/, (statusCode) => {
      expect(result.status).toBe(parseInt(statusCode))
    })
  })

  test('not having any invoice', ({ given, when, then, and }) => {
    given('I am logged in', async () => {
      fakeUser = await userHelper.insertUser(userCollection)
      ;[accessToken, refreshToken] = await userHelper.generateToken(fakeUser)
    })

    given('I do not have any invoices', async () => {
      await taskCollection.deleteMany({})
    })

    when(/^I request to get all invoices of type "(.*)"$/, async (type) => {
      const query = getAllInvoicesQuery({ type })

      result = await request(app)
        .post(environment.GRAPHQL.ENDPOINT)
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then('I should not get any invoices', () => {
      expect(result.body.data.getAllInvoices).toStrictEqual({
        count: 0,
        displaying: 0,
        documents: [],
        page: '1 of 0'
      })
    })

    and(/^I must receive a status code of (.*)$/, (statusCode) => {
      expect(result.status).toBe(parseInt(statusCode))
    })
  })
})
