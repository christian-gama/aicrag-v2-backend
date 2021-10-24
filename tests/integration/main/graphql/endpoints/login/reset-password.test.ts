import { IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'

import { setupApp } from '@/main/express/config/app'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import { makeGenerateRefreshToken, makeGenerateAccessToken } from '@/factories/providers/token'

import { makeFakeUser } from '@/tests/__mocks__'

import { Express } from 'express'
import request from 'supertest'

let app: Express

describe('mutation resetPassword', () => {
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
        resetPassword (input: { password: "new_password", passwordConfirmation: "new_password" }) {
          refreshToken
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

  it('should return 403 if user is logged in', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await request(app)
      .post('/graphql')
      .set('Cookie', `refreshToken=${refreshToken};accessToken=${accessToken}`)
      .send({ query })
      .expect(403)
  })

  it('should return 401 if token is missing', async () => {
    expect.assertions(0)

    await request(app).post('/graphql').send({ query }).expect(401)
  })

  it('should return 401 if token is invalid', async () => {
    expect.assertions(0)

    await request(app).post('/graphql').set('Cookie', 'accessToken=invalid_token').send({ query }).expect(401)
  })

  it('should return 400 if params are invalid', async () => {
    expect.assertions(0)

    fakeUser.temporary.resetPasswordToken = accessToken
    await userCollection.insertOne(fakeUser)

    query = query.replace('new_password', 'invalid_password')

    await request(app).post('/graphql').set('Cookie', `accessToken=${accessToken}`).send({ query }).expect(400)
  })

  it('should return 200 if params are valid', async () => {
    expect.assertions(0)

    fakeUser.temporary.resetPasswordToken = accessToken
    await userCollection.insertOne(fakeUser)

    await request(app).post('/graphql').set('Cookie', `accessToken=${accessToken}`).send({ query }).expect(200)
  })
})
