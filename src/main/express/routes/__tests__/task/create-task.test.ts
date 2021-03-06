import { ITask, ITaskData, IUser } from '@/domain'
import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'
import App from '@/main/express/config/app'
import { makeMongoDb } from '@/main/factories/database/mongo-db-factory'
import { makeGenerateAccessToken, makeGenerateRefreshToken } from '@/main/factories/providers/token'
import { makeFakeTask, makeFakeUser } from '@/tests/__mocks__'
import { Express } from 'express'
import request from 'supertest'

describe('post /task', () => {
  const client = makeMongoDb()
  let app: Express
  let accessToken: string
  let dbIsConnected = true
  let fakeTask: ITask
  let fakeTaskData: ITaskData
  let fakeUser: IUser
  let refreshToken: string
  let taskCollection: ICollectionMethods
  let userCollection: ICollectionMethods

  afterAll(async () => {
    if (!dbIsConnected) await client.disconnect()
  })

  afterEach(async () => {
    await taskCollection.deleteMany({})
    await userCollection.deleteMany({})
  })

  beforeAll(async () => {
    dbIsConnected = MongoAdapter.client !== null
    if (!dbIsConnected) await MongoAdapter.connect(global.__MONGO_URI__)

    app = await App.setup()

    taskCollection = client.collection('tasks')
    userCollection = client.collection('users')
  })

  beforeEach(async () => {
    fakeUser = makeFakeUser()
    fakeTask = makeFakeTask(fakeUser)
    fakeTaskData = {
      commentary: fakeTask.commentary,
      date: fakeTask.date.full.toISOString(),
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
    await userCollection.insertOne(fakeUser)

    const result = await request(app).post('/api/v1/task').send()

    expect(result.status).toBe(401)
  })

  it('should return 400 if validation fails', async () => {
    await userCollection.insertOne(fakeUser)

    const result = await request(app)
      .post('/api/v1/task')
      .set('x-access-token', accessToken)
      .set('x-refresh-token', refreshToken)
      .send({})

    expect(result.status).toBe(400)
  })

  it('should return 409 if taskId already exists', async () => {
    await userCollection.insertOne(fakeUser)
    await taskCollection.insertOne(fakeTask)

    const result = await request(app)
      .post('/api/v1/task')
      .set('x-access-token', accessToken)
      .set('x-refresh-token', refreshToken)
      .send(fakeTaskData)

    expect(result.status).toBe(409)
  })

  it('should return 400 if miss a param or param is invalid', async () => {
    await userCollection.insertOne(fakeUser)

    const result = await request(app)
      .post('/api/v1/task')
      .set('x-access-token', accessToken)
      .set('x-refresh-token', refreshToken)
      .send()

    expect(result.status).toBe(400)
  })

  it('should return 201 if all validations succeeds', async () => {
    await userCollection.insertOne(fakeUser)

    const result = await request(app)
      .post('/api/v1/task')
      .set('x-access-token', accessToken)
      .set('x-refresh-token', refreshToken)
      .send(fakeTaskData)

    expect(result.status).toBe(201)
  }, 12000)
})
