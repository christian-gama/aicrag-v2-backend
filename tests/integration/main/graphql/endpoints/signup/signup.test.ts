import { IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'

import { setupApp } from '@/main/express/config/app'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import { makeGenerateAccessToken, makeGenerateRefreshToken } from '@/factories/providers/token'

import { makeFakeUser } from '@/tests/__mocks__'

import { Express } from 'express'
import request from 'supertest'

let app: Express

describe('mutation signUp', () => {
  const client = makeMongoDb()
  let accessToken: string
  let fakeUser: IUser
  let refreshToken: string
  let query: string
  let userCollection: ICollectionMethods

  afterAll(async () => {
    await client.disconnect()
  })

  afterEach(async () => {
    await userCollection.deleteMany({})
  })

  beforeAll(async () => {
    app = await setupApp()

    await MongoAdapter.connect(global.__MONGO_URI__)

    userCollection = client.collection('users')
  })

  beforeEach(async () => {
    fakeUser = makeFakeUser()
    accessToken = makeGenerateAccessToken().generate(fakeUser)
    refreshToken = await makeGenerateRefreshToken().generate(fakeUser)
    query = `
      mutation {
        signUp(input: {
          email: "${fakeUser.personal.email}",
          name: "${fakeUser.personal.name}",
          password: "${fakeUser.personal.password}",
          passwordConfirmation: "${fakeUser.personal.password}"
        }) {
          user {
              personal {
                  email
                  id
                  name
              }
              settings {
                  currency
              }
          }
        }
      }
    `
  })

  it('should return 403 if user is already logged in', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await request(app)
      .post('/graphql')
      .set('x-access-token', accessToken)
      .set('x-refresh-token', refreshToken)
      .send({ query })
      .expect(403)
  })

  it('should return 400 if validation fails', async () => {
    expect.assertions(0)

    query = query.replace(fakeUser.personal.password, '123')

    await request(app).post('/graphql').send({ query }).expect(400)
  })

  it('should return 409 if email already exists', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await request(app).post('/graphql').send({ query }).expect(409)
  })

  it('should return 200 if all validations succeeds', async () => {
    expect.assertions(0)

    await request(app).post('/graphql').send({ query }).expect(200)
  }, 12000)
})
