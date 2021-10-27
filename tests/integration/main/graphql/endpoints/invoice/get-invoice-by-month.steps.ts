import { ITask, IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'

import { setupApp } from '@/main/express/config/app'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'

import { getInvoiceByMonthQuery } from '@/tests/helpers/queries'
import { taskHelper } from '@/tests/helpers/task-helper.ts'
import { userHelper } from '@/tests/helpers/user-helper'

import { Express } from 'express'
import { loadFeature, defineFeature } from 'jest-cucumber'
import MockDate from 'mockdate'
import path from 'path'
import request from 'supertest'

const feature = loadFeature(path.resolve(__dirname, 'get-invoice-by-month.feature'))

defineFeature(feature, (test) => {
  const client = makeMongoDb()
  let accessToken: string
  let app: Express
  let fakeUser: IUser
  let refreshToken: string
  let result: any
  let tasks: ITask[]
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

  test('i want to get all invoices from a specific month from a year', ({ given, when, then, and }) => {
    expect.hasAssertions()

    given('I am logged in', async () => {
      fakeUser = await userHelper.insertUser(userCollection)
      ;[accessToken, refreshToken] = await userHelper.generateToken(fakeUser)
    })

    given('I have the following tasks:', async (table) => {
      tasks = await Promise.all(
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

    when(
      /^I request to get my invoices from month "(.*)" and year "(.*)" of type "(.*)"$/,
      async (month, year, type) => {
        const query = getInvoiceByMonthQuery({ month, type, year })

        result = await request(app)
          .post('/graphql')
          .set('x-access-token', accessToken)
          .set('x-refresh-token', refreshToken)
          .send({ query })
      }
    )

    then('I should get the following invoice:', (table) => {
      const invoice = table.map((row, index) => {
        const date = new Date(Date.parse(row.date))

        return {
          commentary: row.commentary,
          date: {
            day: date.getUTCDate(),
            full: date.toISOString(),
            hours: date.toLocaleTimeString('pt-br', { timeZone: 'UTC' }),
            month: date.getUTCMonth(),
            year: date.getUTCFullYear()
          },
          duration: +row.duration,
          id: tasks[index].id,
          logs: {
            createdAt: tasks[index].logs.createdAt.toISOString(),
            updatedAt: tasks[index].logs.updatedAt
          },
          status: row.status,
          taskId: row.taskId,
          type: row.type,
          usd: Math.round((+row.duration / 60) * (row.type === 'TX' ? 65 : 112.5) * 100) / 100,
          user: {
            personal: {
              email: fakeUser.personal.email,
              id: fakeUser.personal.id,
              name: fakeUser.personal.name
            },
            settings: {
              currency: fakeUser.settings.currency
            }
          }
        }
      })

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

  test('requesting to get an invoice by month being logged out', ({ given, when, then, and }) => {
    expect.hasAssertions()

    given('I am logged out', () => {
      accessToken = ''
      refreshToken = ''
    })

    when(
      /^I request to get my invoices from month "(.*)" and year "(.*)" of type "(.*)"$/,
      async (month, year, type) => {
        const query = getInvoiceByMonthQuery({ month, type, year })

        result = await request(app)
          .post('/graphql')
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

  test('i want to get all invoices from a specific month and year using a filter', ({ given, when, then, and }) => {
    expect.hasAssertions()

    given('I am logged in', async () => {
      fakeUser = await userHelper.insertUser(userCollection)
      ;[accessToken, refreshToken] = await userHelper.generateToken(fakeUser)
    })

    given('I have the following tasks:', async (table) => {
      tasks = await Promise.all(
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

    when(
      /^I request to get my invoices from month "(.*)" and year "(.*)" of type "(.*)" limiting by "(.*)"$/,
      async (month, year, type, limit) => {
        const query = getInvoiceByMonthQuery({ limit, month, type, year })

        result = await request(app)
          .post('/graphql')
          .set('x-access-token', accessToken)
          .set('x-refresh-token', refreshToken)
          .send({ query })
      }
    )

    then('I should get the following invoice:', (table) => {
      const invoice = table.map((row, index) => {
        const date = new Date(Date.parse(row.date))

        return {
          commentary: row.commentary,
          date: {
            day: date.getUTCDate(),
            full: date.toISOString(),
            hours: date.toLocaleTimeString('pt-br', { timeZone: 'UTC' }),
            month: date.getUTCMonth(),
            year: date.getUTCFullYear()
          },
          duration: +row.duration,
          id: tasks[index].id,
          logs: {
            createdAt: tasks[index].logs.createdAt.toISOString(),
            updatedAt: tasks[index].logs.updatedAt
          },
          status: row.status,
          taskId: row.taskId,
          type: row.type,
          usd: Math.round((+row.duration / 60) * (row.type === 'TX' ? 65 : 112.5) * 100) / 100,
          user: {
            personal: {
              email: fakeUser.personal.email,
              id: fakeUser.personal.id,
              name: fakeUser.personal.name
            },
            settings: {
              currency: fakeUser.settings.currency
            }
          }
        }
      })

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
