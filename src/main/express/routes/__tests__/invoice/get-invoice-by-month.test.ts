import { ITask, IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'

import App from '@/main/express/config/app'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import { makeGenerateAccessToken, makeGenerateRefreshToken } from '@/factories/providers/token'

import { makeFakeTask, makeFakeUser } from '@/tests/__mocks__'

import { Express } from 'express'
import request from 'supertest'

describe('get /invoice/get-invoice-by-month', () => {
  const client = makeMongoDb()
  let app: Express
  let accessToken: string
  let dbIsConnected = true
  let fakeTask: ITask
  let fakeUser: IUser
  let refreshToken: string
  let taskCollection: ICollectionMethods
  let userCollection: ICollectionMethods

  afterAll(async () => {
    if (!dbIsConnected) await client.disconnect()
  })

  afterEach(async () => {
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
    accessToken = makeGenerateAccessToken().generate(fakeUser)
    refreshToken = await makeGenerateRefreshToken().generate(fakeUser)
  })

  it('should return 401 if user is not logged in', async () => {
    await userCollection.insertOne(fakeUser)

    const result = await request(app).get('/api/v1/invoice/get-invoice-by-month')

    expect(result.status).toBe(401)
  })

  it('should return 400 if query validation fails', async () => {
    await userCollection.insertOne(fakeUser)

    const result = await request(app)
      .get('/api/v1/invoice/get-invoice-by-month?sort=a&sort=b&month=0&year=2021')
      .set('x-access-token', accessToken)
      .set('x-refresh-token', refreshToken)

    expect(result.status).toBe(400)
  })

  it('should return 400 if month or year are invalid', async () => {
    await userCollection.insertOne(fakeUser)

    const result = await request(app)
      .get('/api/v1/invoice/get-invoice-by-month?month=123&year=123')
      .set('x-access-token', accessToken)
      .set('x-refresh-token', refreshToken)

    expect(result.status).toBe(400)
  })

  it('should return 400 if misses month, year or type', async () => {
    await userCollection.insertOne(fakeUser)

    const result = await request(app)
      .get('/api/v1/invoice/get-invoice-by-month')
      .set('x-access-token', accessToken)
      .set('x-refresh-token', refreshToken)

    expect(result.status).toBe(400)
  })

  it('should return 400 with if type is invalid', async () => {
    await userCollection.insertOne(fakeUser)

    const result = await request(app)
      .get('/api/v1/invoice/get-invoice-by-month?month=0&year=2021&type=invalid_type')
      .set('x-access-token', accessToken)
      .set('x-refresh-token', refreshToken)

    expect(result.status).toBe(400)
  })

  it('should return 200 with if does not find any tasks', async () => {
    await userCollection.insertOne(fakeUser)

    const result = await request(app)
      .get('/api/v1/invoice/get-invoice-by-month?month=0&year=2021&type=TX')
      .set('x-access-token', accessToken)
      .set('x-refresh-token', refreshToken)

    expect(result.status).toBe(200)
  })

  it('should return 200 if find a task', async () => {
    await userCollection.insertOne(fakeUser)
    await taskCollection.insertOne(fakeTask)

    const result = await request(app)
      .get(
        `/api/v1/invoice/get-invoice-by-month?month=${fakeTask.date.month}&year=${fakeTask.date.year}&type=${fakeTask.type}`
      )
      .set('x-access-token', accessToken)
      .set('x-refresh-token', refreshToken)

    expect(result.status).toBe(200)
  }, 12000)

  it('should return 200 if all validations succeeds and find a task', async () => {
    await userCollection.insertOne(fakeUser)
    await taskCollection.insertOne(fakeTask)

    const result = await request(app)
      .get(
        `/api/v1/invoice/get-invoice-by-month?month=${fakeTask.date.month}&year=${fakeTask.date.year}&type=${fakeTask.type}&sort=usd,-date.full&limit=2&page=1`
      )
      .set('x-access-token', accessToken)
      .set('x-refresh-token', refreshToken)

    expect(result.status).toBe(200)
    expect(result.body.data.documents[0].id).toBe(fakeTask.id)
  }, 12000)

  it('should return 200 if all validations succeeds and find a task with a taskId', async () => {
    await userCollection.insertOne(fakeUser)
    await taskCollection.insertOne(fakeTask)

    const result = await request(app)
      .get(
        `/api/v1/invoice/get-invoice-by-month?month=${fakeTask.date.month}&year=${fakeTask.date.year}&type=both&taskId=${fakeTask.taskId}&sort=usd,-date.full&limit=2&page=1`
      )
      .set('x-access-token', accessToken)
      .set('x-refresh-token', refreshToken)

    expect(result.status).toBe(200)
    expect(result.body.data.documents[0].id).toBe(fakeTask.id)
  }, 12000)
})
