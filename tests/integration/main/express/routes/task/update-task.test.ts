import { ITask, IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'

import { setupApp } from '@/main/express/config/app'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import { makeGenerateAccessToken, makeGenerateRefreshToken } from '@/factories/providers/token'

import { makeFakeTask, makeFakeUser } from '@/tests/__mocks__'

import assert from 'assert'
import { Express } from 'express'
import request from 'supertest'

let app: Express

describe('patch /task/:id', () => {
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

    await request(app).patch('/api/v1/task/any_id').expect(401)
  })

  it('should return 400 if validation fails', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await request(app)
      .patch('/api/v1/task/invalid_id')
      .set('Cookie', `refreshToken=${refreshToken};accessToken=${accessToken}`)
      .send({ duration: 30, type: 'QA' })
      .expect(400)
  })

  it('should return 400 if does not find a task', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await request(app)
      .patch('/api/v1/task/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx')
      .set('Cookie', `refreshToken=${refreshToken};accessToken=${accessToken}`)
      .expect(400)
  })

  it('should return 200 if all validations succeeds', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)
    await taskCollection.insertOne(fakeTask)

    await request(app)
      .patch(`/api/v1/task/${fakeTask.id}`)
      .set('Cookie', `refreshToken=${refreshToken};accessToken=${accessToken}`)
      .send({ duration: 2.4, type: 'QA' })
      .expect(200)
      .then((response) => {
        assert(response.body.data.task.duration === 2.4)
        assert(response.body.data.task.type === 'QA')
      })
  }, 12000)

  it('should return 200 if there is no changes', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)
    await taskCollection.insertOne(fakeTask)

    await request(app)
      .patch(`/api/v1/task/${fakeTask.id}`)
      .set('Cookie', `refreshToken=${refreshToken};accessToken=${accessToken}`)
      .send({})
      .expect(200)
      .then((response) => assert(response.body.data.message === 'No changes were made'))
  }, 12000)
})
