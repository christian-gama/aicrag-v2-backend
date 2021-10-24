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

describe('mutation createTask', () => {
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
      mutation {
        createTask(
          input: {
            commentary: "${fakeTask.commentary}",
            date: "${fakeTask.date.full.toString()}",
            duration: ${fakeTask.duration},
            status: ${fakeTask.status},
            taskId: "${fakeTask.taskId}",
            type: ${fakeTask.type} }) {
          task {
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

  it('should return 400 if validation fails', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    query = query.replace(`${fakeTask.duration}`, '100')

    await request(app)
      .post('/graphql')
      .set('Cookie', `refreshToken=${refreshToken};accessToken=${accessToken}`)
      .send({ query })
      .expect(400)
  })

  it('should return 409 if taskId already exists', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)
    await taskCollection.insertOne(fakeTask)

    await request(app)
      .post('/graphql')
      .set('Cookie', `refreshToken=${refreshToken};accessToken=${accessToken}`)
      .send({ query })
      .expect(409)
  })

  it('should return 200 if all validations succeeds', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await request(app)
      .post('/graphql')
      .set('Cookie', `refreshToken=${refreshToken};accessToken=${accessToken}`)
      .send({ query })
      .expect(200)
  }, 12000)
})
