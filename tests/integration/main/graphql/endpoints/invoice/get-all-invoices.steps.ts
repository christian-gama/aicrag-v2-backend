import { IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'

import { setupApp } from '@/main/express/config/app'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'

import { getAllInvoicesQuery } from '@/tests/helpers/queries'
import { taskHelper } from '@/tests/helpers/task-helper.ts'
import { userHelper } from '@/tests/helpers/user-helper'

import { Express } from 'express'
import { loadFeature, defineFeature } from 'jest-cucumber'
import MockDate from 'mockdate'
import path from 'path'
import request from 'supertest'

const feature = loadFeature(path.resolve(__dirname, 'get-all-invoices.feature'))

defineFeature(feature, (test) => {
  const client = makeMongoDb()
  let accessToken: string
  let app: Express
  let fakeUser: IUser
  let refreshToken: string
  let result: any
  let taskCollection: ICollectionMethods
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
    taskCollection = client.collection('tasks')
  })

  test('i have invoices from different months', ({ given, when, then, and }) => {
    expect.hasAssertions()

    given('I am logged in', async () => {
      fakeUser = await userHelper.insertUser(userCollection)
      ;[accessToken, refreshToken] = await userHelper.generateToken(fakeUser)
    })

    given('I have the following tasks:', async (table) => {
      await Promise.all(
        table.map(async (row) => {
          const date = new Date(Date.parse(row.date))

          return await taskHelper.insertTask(taskCollection, fakeUser, {
            commentary: row.commentary,
            date: {
              day: date.getUTCDate(),
              full: date,
              hours: date.toLocaleTimeString('pt-br', { timeZone: 'UTC' }),
              month: date.getUTCMonth(),
              year: date.getUTCFullYear()
            },
            duration: +row.duration,
            status: row.status,
            taskId: row.taskId,
            type: row.type,
            usd: Math.round((+row.duration / 60) * (row.type === 'TX' ? 65 : 112.5) * 100) / 100
          })
        })
      )
    })

    when(/^I request to get all invoices of type "(.*)"$/, async (type) => {
      const query = getAllInvoicesQuery({ type })

      result = await request(app)
        .post('/graphql')
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

  test('requesting to get all invoices being logged out', ({ given, when, then, and }) => {
    expect.hasAssertions()

    given('I am logged out', () => {
      accessToken = ''
      refreshToken = ''
    })

    when(/^I request to get all invoices of type "(.*)"$/, async (type) => {
      const query = getAllInvoicesQuery({ type })

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

  test('i do not have any invoices yet', ({ given, when, then, and }) => {
    expect.hasAssertions()

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
        .post('/graphql')
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
