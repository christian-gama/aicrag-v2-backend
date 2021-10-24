import { IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'

import { setupApp } from '@/main/express/config/app'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import { makeGenerateRefreshToken } from '@/factories/providers/token'

import { makeFakeUser } from '@/tests/__mocks__'

import { Express } from 'express'
import request from 'supertest'

let app: Express

describe('mutation forgotPassword', () => {
  const client = makeMongoDb()
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
    fakeUser.temporary.resetPasswordToken = 'any_token'
    refreshToken = await makeGenerateRefreshToken().generate(fakeUser)
    query = `
      mutation {
        forgotPassword (input: { email: "${fakeUser.personal.email}" }) {
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

  it('should return 200 if all validations succeeds', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await request(app).post('/graphql').send({ query }).expect(200)
  })

  it('should return 400 if email does not exist', async () => {
    expect.assertions(0)

    await request(app).post('/graphql').send({ query }).expect(400)
  })

  it('should return 400 if there is no resetPasswordToken', async () => {
    expect.assertions(0)

    fakeUser.temporary.resetPasswordToken = null

    await request(app).post('/graphql').send({ query }).expect(400)
  })

  it('should return 403 if user is logged in', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await request(app).post('/graphql').set('Cookie', `refreshToken=${refreshToken}`).send({ query }).expect(403)
  })
})
