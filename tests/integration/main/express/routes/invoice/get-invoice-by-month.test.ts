import { ITask, IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { CollectionProtocol } from '@/infra/database/protocols'

import app from '@/main/express/config/app'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import { makeGenerateAccessToken, makeGenerateRefreshToken } from '@/factories/providers/token'

import { makeFakeTask, makeFakeUser } from '@/tests/__mocks__'

import assert from 'assert'
import request from 'supertest'

describe('get /invoice/get-invoice-by-month', () => {
  const client = makeMongoDb()
  let accessToken: string
  let fakeTask: ITask
  let fakeUser: IUser
  let refreshToken: string
  let taskCollection: CollectionProtocol
  let userCollection: CollectionProtocol

  afterAll(async () => {
    await client.disconnect()
  })

  afterEach(async () => {
    await taskCollection.deleteMany({})
  })

  beforeAll(async () => {
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

    await request(app).get('/api/v1/invoice/get-invoice-by-month').expect(401)
  })

  it('should return 400 if query validation fails', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await request(app)
      .get('/api/v1/invoice/get-invoice-by-month?sort=a&sort=b&month=0&year=2021')
      .set('Cookie', `refreshToken=${refreshToken};accessToken=${accessToken}`)
      .expect(400)
  })

  it('should return 400 if month or year are invalid', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await request(app)
      .get('/api/v1/invoice/get-invoice-by-month?month=123&year=123')
      .set('Cookie', `refreshToken=${refreshToken};accessToken=${accessToken}`)
      .expect(400)
  })

  it('should return 400 if misses month or year', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await request(app)
      .get('/api/v1/invoice/get-invoice-by-month')
      .set('Cookie', `refreshToken=${refreshToken};accessToken=${accessToken}`)
      .expect(400)
  })

  it('should return 200 with if does not find any tasks', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await request(app)
      .get('/api/v1/invoice/get-invoice-by-month?month=0&year=2021')
      .set('Cookie', `refreshToken=${refreshToken};accessToken=${accessToken}`)
      .expect(200)
  })

  it('should return 200 if find a task', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)
    await taskCollection.insertOne(fakeTask)

    await request(app)
      .get(
        `/api/v1/invoice/get-invoice-by-month?month=${fakeTask.date.month}&year=${fakeTask.date.year}`
      )
      .set('Cookie', `refreshToken=${refreshToken};accessToken=${accessToken}`)
      .expect(200)
  }, 12000)

  it('should return 200 if all validations succeeds and find a task', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)
    await taskCollection.insertOne(fakeTask)

    await request(app)
      .get(
        `/api/v1/invoice/get-invoice-by-month?month=${fakeTask.date.month}&year=${fakeTask.date.year}&sort=usd,-date.full&limit=2&page=1`
      )
      .set('Cookie', `refreshToken=${refreshToken};accessToken=${accessToken}`)
      .expect(200)
      .then((response) => assert(response.body.data.documents[0].id === fakeTask.id))
  }, 12000)

  it('should return 200 if all validations succeeds and find a task with a taskId', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)
    await taskCollection.insertOne(fakeTask)

    await request(app)
      .get(
        `/api/v1/invoice/get-invoice-by-month?month=${fakeTask.date.month}&year=${fakeTask.date.year}&taskId=${fakeTask.taskId}&sort=usd,-date.full&limit=2&page=1`
      )
      .set('Cookie', `refreshToken=${refreshToken};accessToken=${accessToken}`)
      .expect(200)
      .then((response) => assert(response.body.data.documents[0].taskId === fakeTask.taskId))
  }, 12000)
})