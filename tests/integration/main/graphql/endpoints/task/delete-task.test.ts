import { ITask, IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'

import { environment } from '@/main/config/environment'
import App from '@/main/express/config/app'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import { makeGenerateAccessToken, makeGenerateRefreshToken } from '@/factories/providers/token'

import { makeFakeTask, makeFakeUser } from '@/tests/__mocks__'

import { Express } from 'express'
import request from 'supertest'

let app: Express

describe('mutation deleteTask', () => {
  const client = makeMongoDb()
  let accessToken: string
  let dbIsConnected = true
  let fakeTask: ITask
  let fakeUser: IUser
  let refreshToken: string
  let taskCollection: ICollectionMethods
  let query: string
  let userCollection: ICollectionMethods

  afterAll(async () => {
    if (!dbIsConnected) await client.disconnect()
  })

  afterEach(async () => {
    await taskCollection.deleteMany({})
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
    query = `
      mutation {
        deleteTask(param: { id: "${fakeTask.id}"}) {
          status
        }
      }
    `
  })

  it('should return 401 if user is not logged in', async () => {
    await userCollection.insertOne(fakeUser)

    await request(app).post(environment.GRAPHQL.ENDPOINT).send({ query }).expect(401)
  })

  it('should return 400 if does not find a task', async () => {
    await userCollection.insertOne(fakeUser)
    query = query.replace(fakeTask.id, '5e9f8f8f-8f8f-8f8f-8f8f-8f8f8f8f8f8f')

    await request(app)
      .post(environment.GRAPHQL.ENDPOINT)
      .set('x-access-token', accessToken)
      .set('x-refresh-token', refreshToken)
      .send({ query })
      .expect(400)
  })

  it('should return 204 if all validations succeeds', async () => {
    await userCollection.insertOne(fakeUser)
    await taskCollection.insertOne(fakeTask)

    await request(app)
      .post(environment.GRAPHQL.ENDPOINT)
      .set('x-access-token', accessToken)
      .set('x-refresh-token', refreshToken)
      .send({ query })
      .expect(200)
  }, 12000)
})
