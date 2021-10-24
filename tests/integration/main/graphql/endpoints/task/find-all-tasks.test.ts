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

describe('query findAllTasks', () => {
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
        findAllTasks(query: { sort: "-date.full", limit: "10", page: "1" }) {
          count
          displaying
          page
          documents {
              commentary
              date {
                  full
                  day
                  hours
                  month
                  year
              }
              duration
              id
              logs {
                  createdAt
                  updatedAt
              }
              status
              taskId
              type
              usd
              user {
                personal {
                  email
                  name
                  id
                }
                settings {
                  currency
                }
              }
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

    expect(response.status).toBe(200)
    expect(response.body.data.findAllTasks.count).toBe(0)
  })

  it('should return 200 if find a task', async () => {
    expect.hasAssertions()

    await userCollection.insertOne(fakeUser)
    await taskCollection.insertOne(fakeTask)

    const response = await request(app)
      .post('/graphql')
      .set('Cookie', `refreshToken=${refreshToken};accessToken=${accessToken}`)
      .send({ query })

    expect(response.status).toBe(200)
    expect(response.body.data.findAllTasks.count).toBe(1)
  }, 12000)
})
