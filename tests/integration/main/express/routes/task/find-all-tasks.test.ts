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

describe('get /task', () => {
  const client = makeMongoDb()
  let accessToken: string
  let fakeTask: ITask
  let fakeUser: IUser
  let refreshToken: string
  let taskCollection: ICollectionMethods
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
  })

  it('should return 401 if user is not logged in', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await request(app).get('/api/v1/task').expect(401)
  })

  it('should return 400 if query validation fails', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await request(app)
      .get('/api/v1/task?sort=a&sort=b')
      .set('x-access-token', accessToken)
      .set('x-refresh-token', refreshToken)
      .expect(400)
  })

  it('should return 200 with if does not find any tasks', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await request(app)
      .get('/api/v1/task')
      .set('x-access-token', accessToken)
      .set('x-refresh-token', refreshToken)
      .expect(200)
  })

  it('should return 200 if find a task', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)
    await taskCollection.insertOne(fakeTask)

    await request(app)
      .get('/api/v1/task')
      .set('x-access-token', accessToken)
      .set('x-refresh-token', refreshToken)
      .expect(200)
  }, 12000)

  it('should return 200 if all validations succeeds and find a task', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)
    await taskCollection.insertOne(fakeTask)

    await request(app)
      .get('/api/v1/task?fields=duration,commentary,usd&sort=usd,-date.full&limit=2&page=1')
      .set('x-access-token', accessToken)
      .set('x-refresh-token', refreshToken)
      .expect(200)
  }, 12000)
})
