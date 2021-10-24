import { IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'

import { setupApp } from '@/main/express/config/app'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import { makeGenerateAccessToken } from '@/factories/providers/token'

import { makeFakeUser } from '@/tests/__mocks__'

import { Express } from 'express'
import request from 'supertest'

let app: Express

describe('mutation activateAccount', () => {
  const client = makeMongoDb()
  let accessToken: string
  let fakeUser: IUser
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
    fakeUser.temporary.activationCode = 'any_code'
    fakeUser.settings.accountActivated = false
    accessToken = makeGenerateAccessToken().generate(fakeUser)
    query = `
      mutation {
        activateAccount (input: { email: "${fakeUser.personal.email}", activationCode: "any_code" }) {
          accessToken
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

  it('should return 200 if all validations succeeds', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await request(app).post('/graphql').set('Cookie', `accessToken=${accessToken}`).send({ query }).expect(200)
  })

  it('should return 401 if user does not have access token', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await request(app).post('/graphql').send({ query }).expect(401)
  })

  it('should return 400 if code is invalid', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)
    query = query.replace('any_code', 'invalid_code')

    await request(app).post('/graphql').set('Cookie', `accessToken=${accessToken}`).send({ query }).expect(400)
  })

  it('should return 400 if code is expired', async () => {
    expect.assertions(0)

    fakeUser.temporary.activationCodeExpiration = new Date(Date.now() - 1000)
    await userCollection.insertOne(fakeUser)

    await request(app).post('/graphql').set('Cookie', `accessToken=${accessToken}`).send({ query }).expect(400)
  })

  it('should return 400 if account is already activated', async () => {
    expect.assertions(0)

    fakeUser.settings.accountActivated = true
    await userCollection.insertOne(fakeUser)

    await request(app).post('/graphql').set('Cookie', `accessToken=${accessToken}`).send({ query }).expect(400)
  })
})
