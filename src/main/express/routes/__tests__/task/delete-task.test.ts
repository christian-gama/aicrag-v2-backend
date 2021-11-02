import { ITask, IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'

import App from '@/main/express/config/app'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import { makeGenerateAccessToken, makeGenerateRefreshToken } from '@/factories/providers/token'

import { makeFakeTask, makeFakeUser } from '@/tests/__mocks__'

import { Express } from 'express'
import request from 'supertest'

describe('delete /task/:id', () => {
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
    accessToken = makeGenerateAccessToken().generate(fakeUser)
    refreshToken = await makeGenerateRefreshToken().generate(fakeUser)
  })

  it('should return 401 if user is not logged in', async () => {
    await userCollection.insertOne(fakeUser)

    const result = await request(app).delete('/api/v1/task/any_id')

    expect(result.status).toBe(401)
  })

  it('should return 400 if validation fails', async () => {
    await userCollection.insertOne(fakeUser)

    const result = await request(app)
      .delete('/api/v1/task/invalid_id')
      .set('x-access-token', accessToken)
      .set('x-refresh-token', refreshToken)

    expect(result.status).toBe(400)
  })

  it('should return 400 if does not find a task', async () => {
    await userCollection.insertOne(fakeUser)

    const result = await request(app)
      .delete('/api/v1/task/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx')
      .set('x-access-token', accessToken)
      .set('x-refresh-token', refreshToken)

    expect(result.status).toBe(400)
  })

  it('should return 204 if all validations succeeds', async () => {
    await userCollection.insertOne(fakeUser)
    await taskCollection.insertOne(fakeTask)

    const result = await request(app)
      .delete(`/api/v1/task/${fakeTask.id}`)
      .set('x-access-token', accessToken)
      .set('x-refresh-token', refreshToken)

    expect(result.status).toBe(204)
  }, 12000)
})
