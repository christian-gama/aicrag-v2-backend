import { ITask, IUser } from '@/domain'

import { ICollectionMethods } from '@/infra/database/protocols'

import App from '@/main/express/config/app'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import { makeGenerateAccessToken, makeGenerateRefreshToken } from '@/factories/providers/token'

import { makeFakeTask, makeFakeUser } from '@/tests/__mocks__'

import { Express } from 'express'
import request from 'supertest'

let app: Express

export default (): void =>
  describe('mutation updateTask', () => {
    const client = makeMongoDb()
    let accessToken: string
    let fakeTask: ITask
    let fakeUser: IUser
    let refreshToken: string
    let taskCollection: ICollectionMethods
    let query: string
    let userCollection: ICollectionMethods

    afterEach(async () => {
      await taskCollection.deleteMany({})
    })

    beforeAll(async () => {
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
        updateTask(
          param: { id: "${fakeTask.id}" },
          input: {
            commentary: "${fakeTask.commentary}",
            date: "${fakeTask.date.full.toString()}",
            duration: ${fakeTask.duration},
            status: ${fakeTask.status},
            taskId: "${fakeTask.taskId}",
            type: ${fakeTask.type}
          }) {
            ... on UpdateTaskHasChanges {
              task {
                  commentary
                  date {
                      day
                      full
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
            ... on UpdateTaskNoChanges {
                message
            }
          }
        }
      `
    })

    it('should return 401 if user is not logged in', async () => {
      await userCollection.insertOne(fakeUser)

      await request(app).post('/graphql').send({ query }).expect(401)
    })

    it('should return 400 if validation fails', async () => {
      await userCollection.insertOne(fakeUser)
      query = query.replace(`${fakeTask.duration}`, '100')

      await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
        .expect(400)
    })

    it('should return 400 if does not find a task', async () => {
      await userCollection.insertOne(fakeUser)
      query = query.replace(`${fakeTask.id}`, '5e9f8f0f-b8f9-4f8f-b8f9-4f8f8f8f8f8f')

      await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
        .expect(400)
    })

    it('should return 200 if all validations succeeds', async () => {
      await userCollection.insertOne(fakeUser)
      await taskCollection.insertOne(fakeTask)

      const response = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })

      expect(response.statusCode).toBe(200)
      expect(response.body.data.updateTask.task.id).toBe(fakeTask.id)
    }, 12000)

    it('should return 200 if there is no changes', async () => {
      await userCollection.insertOne(fakeUser)
      await taskCollection.insertOne(fakeTask)

      query = query.replace(`commentary: "${fakeTask.commentary}"`, '')
      query = query.replace(`date: "${fakeTask.date.full.toString()}"`, '')
      query = query.replace(`duration: ${fakeTask.duration}`, '')
      query = query.replace(`status: ${fakeTask.status}`, '')
      query = query.replace(`taskId: "${fakeTask.taskId}"`, '')
      query = query.replace(`type: ${fakeTask.type}`, '')

      const response = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })

      expect(response.statusCode).toBe(200)

      expect(response.body.data.updateTask.message).toBe('No changes were made')
    }, 12000)
  })
