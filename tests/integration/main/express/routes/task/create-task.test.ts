import { ITask, ITaskData, IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'

import { setupApp } from '@/main/express/config/app'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import { makeGenerateAccessToken, makeGenerateRefreshToken } from '@/factories/providers/token'

import { makeFakeTask, makeFakeUser } from '@/tests/__mocks__'

import { Express } from 'express'
import request from 'supertest'

let app: Express

describe('post /task', () => {
  const client = makeMongoDb()
  let accessToken: string
  let fakeTask: ITask
  let fakeTaskData: ITaskData
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
    fakeTaskData = {
      commentary: fakeTask.commentary,
      date: fakeTask.date.full.toString(),
      duration: fakeTask.duration,
      status: fakeTask.status,
      taskId: fakeTask.taskId,
      type: fakeTask.type,
      user: fakeUser
    }
    accessToken = makeGenerateAccessToken().generate(fakeUser)
    refreshToken = await makeGenerateRefreshToken().generate(fakeUser)
  })

  it('should return 401 if user is not logged in', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await request(app).post('/api/v1/task').send().expect(401)
  })

  it('should return 400 if validation fails', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await request(app)
      .post('/api/v1/task')
      .set('x-access-token', accessToken)
      .set('x-refresh-token', refreshToken)
      .send({})
      .expect(400)
  })

  it('should return 409 if taskId already exists', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)
    await taskCollection.insertOne(fakeTask)

    await request(app)
      .post('/api/v1/task')
      .set('x-access-token', accessToken)
      .set('x-refresh-token', refreshToken)
      .send(fakeTaskData)
      .expect(409)
  })

  it('should return 400 if miss a param or param is invalid', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await request(app)
      .post('/api/v1/task')
      .set('x-access-token', accessToken)
      .set('x-refresh-token', refreshToken)
      .send()
      .expect(400)
  })

  it('should return 201 if all validations succeeds', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await request(app)
      .post('/api/v1/task')
      .set('x-access-token', accessToken)
      .set('x-refresh-token', refreshToken)
      .send(fakeTaskData)
      .expect(201)
  }, 12000)
})
