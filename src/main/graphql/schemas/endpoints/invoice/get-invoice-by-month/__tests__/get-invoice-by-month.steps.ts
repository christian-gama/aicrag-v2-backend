import { ITask, IUser } from '@/domain'
import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'
import { environment } from '@/main/config/environment'
import App from '@/main/express/config/app'
import { makeMongoDb } from '@/main/factories/database/mongo-db-factory'
import { taskHelper } from '@/tests/helpers/task-helper.ts'
import { userHelper } from '@/tests/helpers/user-helper'
import { getInvoiceByMonthQuery } from './get-invoice-by-month-document'
import { Express } from 'express'
import { loadFeature, defineFeature } from 'jest-cucumber'
import MockDate from 'mockdate'
import { resolve } from 'path'
import request from 'supertest'

const feature = loadFeature(resolve(__dirname, 'get-invoice-by-month.feature'))

defineFeature(feature, (test) => {
  const client = makeMongoDb()
  let accessToken: string
  let app: Express
  let dbIsConnected = true
  let fakeUser: IUser
  let refreshToken: string
  let result: any
  let tasks: ITask[]
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

    when(
      /^I request to get my invoices from month "(.*)" and year "(.*)" of type "(.*)"$/,
      async (month, year, type) => {
        const query = getInvoiceByMonthQuery({ month, type, year })

        result = await request(app)
          .post(environment.GRAPHQL.ENDPOINT)
          .set('x-access-token', accessToken)
          .set('x-refresh-token', refreshToken)
          .send({ query })
      }
    )

    then(/^I should receive an error with message "(.*)"$/, (message) => {
      expect(result.body.errors[0].message).toBe(message)
    })

    and(/^I must receive a status code of (.*)$/, (statusCode) => {
      expect(result.status).toBe(parseInt(statusCode))
    })
  })

  test('getting invoices from a specific month and year', ({ given, when, then, and }) => {
    given('I am logged in', async () => {
      fakeUser = await userHelper.insertUser(userCollection)
      ;[accessToken, refreshToken] = await userHelper.generateToken(fakeUser)
    })

    given('I have the following tasks:', async (table) => {
      tasks = await taskHelper.insertTasks(table, taskCollection, fakeUser)
    })

    when(
      /^I request to get my invoices from month "(.*)" and year "(.*)" of type "(.*)"$/,
      async (month, year, type) => {
        const query = getInvoiceByMonthQuery({ month, type, year })

        result = await request(app)
          .post(environment.GRAPHQL.ENDPOINT)
          .set('x-access-token', accessToken)
          .set('x-refresh-token', refreshToken)
          .send({ query })
      }
    )

    then('I should get the following invoice:', (table) => {
      const invoice = taskHelper.getTasks(table, tasks, fakeUser)

      expect(result.body.data.getInvoiceByMonth).toStrictEqual({
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

  test('getting invoices from a specific month and year using filters', ({ given, when, then, and }) => {
    given('I am logged in', async () => {
      fakeUser = await userHelper.insertUser(userCollection)
      ;[accessToken, refreshToken] = await userHelper.generateToken(fakeUser)
    })

    given('I have the following tasks:', async (table) => {
      tasks = await taskHelper.insertTasks(table, taskCollection, fakeUser)
    })

    when(
      /^I request to get my invoices from month "(.*)" and year "(.*)" of type "(.*)" limiting by "(.*)"$/,
      async (month, year, type, limit) => {
        const query = getInvoiceByMonthQuery({ limit, month, type, year })

        result = await request(app)
          .post(environment.GRAPHQL.ENDPOINT)
          .set('x-access-token', accessToken)
          .set('x-refresh-token', refreshToken)
          .send({ query })
      }
    )

    then('I should get the following invoice:', (table) => {
      const invoice = taskHelper.getTasks(table, tasks, fakeUser)

      expect(result.body.data.getInvoiceByMonth.documents).toStrictEqual([invoice[0]])
    })

    and(/^The displaying count should be "(.*)"$/, (displaying) => {
      expect(result.body.data.getInvoiceByMonth.displaying).toBe(parseInt(displaying))
    })

    and(/^The amount page should be "(.*)"$/, (page) => {
      expect(result.body.data.getInvoiceByMonth.page).toBe(page)
    })

    and(/^I must receive a status code of (.*)$/, (statusCode) => {
      expect(result.status).toBe(parseInt(statusCode))
    })
  })
})
