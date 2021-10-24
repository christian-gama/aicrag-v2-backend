import { ITask, IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'

import { setupApp } from '@/main/express/config/app'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import { makeGenerateAccessToken, makeGenerateRefreshToken } from '@/factories/providers/token'

import { makeFakeTask, makeFakeUser } from '@/tests/__mocks__'

import { Express } from 'express'
import request from 'supertest'

let app: Express

describe('query getAllInvoices', () => {
  const client = makeMongoDb()
  let accessToken: string
  let fakeTask: ITask
  let fakeUser: IUser
  let refreshToken: string
  let taskCollection: ICollectionMethods
  let query: string
  let userCollection: ICollectionMethods

  afterAll(async () => {
    await client.disconnect()
  })

  afterEach(async () => {
    await taskCollection.deleteMany({})
  })

  beforeAll(async () => {
    app = await setupApp()

    await MongoAdapter.connect(global.__MONGO_URI__)

    taskCollection = client.collection('tasks')
    userCollection = client.collection('users')
  })

  beforeEach(async () => {
    fakeUser = makeFakeUser()
    fakeTask = makeFakeTask(fakeUser)
    accessToken = makeGenerateAccessToken().generate(fakeUser)
    refreshToken = await makeGenerateRefreshToken().generate(fakeUser)
    query = `
      query {
        getAllInvoices (query: { type: TX }) {
          count
          displaying
          page
          documents {
              date {
                  month
                  year
              }
              tasks
              totalUsd
          }
        }
      }
    `
  })

  it('should return 401 if user is not logged in', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await request(app).post('/graphql').send({ query }).expect(401)
  })

  it('should return 200 with if does not find any tasks', async () => {
    expect.hasAssertions()

    await userCollection.insertOne(fakeUser)

    const response = await request(app)
      .post('/graphql')
      .set('Cookie', `refreshToken=${refreshToken};accessToken=${accessToken}`)
      .send({ query })

    expect(response.statusCode).toBe(200)
    expect(response.body.data.getAllInvoices.count).toBe(0)
  })

  it('should return 200 if find a task', async () => {
    expect.hasAssertions()

    await userCollection.insertOne(fakeUser)
    await taskCollection.insertOne(fakeTask)

    const response = await request(app)
      .post('/graphql')
      .set('Cookie', `refreshToken=${refreshToken};accessToken=${accessToken}`)
      .send({ query })

    expect(response.statusCode).toBe(200)
    expect(response.body.data.getAllInvoices.count).toBe(1)
  }, 12000)

  it('should return 200 if all validations succeeds and find a task', async () => {
    expect.hasAssertions()

    await userCollection.insertOne(fakeUser)
    await taskCollection.insertOne(fakeTask)

    query = query.replace('type: TX', 'type: TX, sort: "totalUsd"')

    const response = await request(app)
      .post('/graphql')
      .set('Cookie', `refreshToken=${refreshToken};accessToken=${accessToken}`)
      .send({ query })

    expect(response.statusCode).toBe(200)
    expect(response.body.data.getAllInvoices.count).toBe(1)
  }, 12000)
})
