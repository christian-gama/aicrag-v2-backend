import { IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'

import { setupApp } from '@/main/express/config/app'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import { makeGenerateAccessToken, makeGenerateRefreshToken } from '@/factories/providers/token'

import { makeFakeUser } from '@/tests/__mocks__/mock-user'

import { hash } from 'bcrypt'
import { Express } from 'express'
import request from 'supertest'

let app: Express

describe('mutation login', () => {
  const client = makeMongoDb()
  let accessToken: string
  let fakeUser: IUser
  let refreshToken: string
  let query: string
  let userCollection: ICollectionMethods
  let userPassword: string

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
    const hashedPassword = await hash(fakeUser.personal.password, 2)
    userPassword = fakeUser.personal.password
    fakeUser.personal.password = hashedPassword
    query = `
      mutation {
        login(input: { email: "${fakeUser.personal.email}", password: "${userPassword}" }) {
          ... on ActiveAccount {
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
          ... on InactiveAccount {
              accessToken
              message
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

  it('should return 401 if user is not logged in', async () => {
    expect.assertions(0)

    await request(app).post('/graphql').send({ query }).expect(401)
  })

  it('should return 400 if miss a param or param is invalid', async () => {
    expect.assertions(0)

    query = query.replace(userPassword, '123')

    await request(app).post('/graphql').send({ query }).expect(400)
  })

  it('should return 200 if account is not activated', async () => {
    expect.hasAssertions()

    fakeUser.settings.accountActivated = false
    await userCollection.insertOne(fakeUser)

    const response = await request(app).post('/graphql').send({ query })

    expect(response.status).toBe(200)
    expect(response.body.data.login.message).toBe('Account is not activated')
  })

  it('should return 200 if all validations succeeds', async () => {
    expect.hasAssertions()

    fakeUser.settings.accountActivated = true
    await userCollection.insertOne(fakeUser)

    const response = await request(app).post('/graphql').send({ query })

    expect(response.status).toBe(200)
    expect(response.body.data.login.accessToken).toBeTruthy()
    expect(response.body.data.login.refreshToken).toBeTruthy()
    expect(response.body.data.login.user.personal.email).toBe(fakeUser.personal.email)
    expect(response.body.data.login.user.personal.id).toBe(fakeUser.personal.id)
    expect(response.body.data.login.user.personal.name).toBe(fakeUser.personal.name)
    expect(response.body.data.login.user.settings.currency).toBe(fakeUser.settings.currency)
  })
})
