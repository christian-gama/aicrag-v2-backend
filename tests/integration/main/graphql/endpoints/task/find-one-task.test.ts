import { ITask, IUser } from '@/domain'

import { ICollectionMethods } from '@/infra/database/protocols'

import { environment } from '@/main/config/environment'
import App from '@/main/express/config/app'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import { makeGenerateAccessToken, makeGenerateRefreshToken } from '@/factories/providers/token'

import { makeFakeTask, makeFakeUser } from '@/tests/__mocks__'

import { Express } from 'express'
import request from 'supertest'

let app: Express

export default (): void =>
  describe('query findOneTask', () => {
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
      query {
        findOneTask(param: { id: "${fakeTask.id}" }) {
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
      }
    `
    })

    it('should return 401 if user is not logged in', async () => {
      await userCollection.insertOne(fakeUser)

      await request(app).post(environment.GRAPHQL.ENDPOINT).send({ query }).expect(401)
    })

    it('should return 400 if does not find a task', async () => {
      await userCollection.insertOne(fakeUser)
      query = query.replace(`${fakeTask.id}`, '5f1d8f0e-f8e9-4f2b-b8f8-f8f8f8f8f8f8')

      await request(app)
        .post(environment.GRAPHQL.ENDPOINT)
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
        .expect(400)
    })

    it('should return 200 if all validations succeeds', async () => {
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
