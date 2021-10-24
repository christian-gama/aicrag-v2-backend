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

describe('mutation updateUser', () => {
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
        updateUser (input: { currency: BRL, email: "any_email@mail.com", name: "Any Name" }) {
          ... on UpdateUserHasChanges {
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
          ... on UpdateUserNoChanges {
              message
          }
      }
      }
    `
  })

  it('should return 401 if user is not logged in', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await request(app).post('/graphql').send({ query }).expect(401)
  })

  it('should return 400 if name is invalid', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)
    query = query.replace('Any Name', 'inv@lid n4me')

    await request(app)
      .post('/graphql')
      .set('Cookie', `refreshToken=${refreshToken};accessToken=${accessToken}`)
      .send({ query })
      .expect(400)
  })

  it('should return 409 if email already exists', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)
    query = query.replace('any_email@mail.com', fakeUser.personal.email)

    await request(app)
      .post('/graphql')
      .set('Cookie', `refreshToken=${refreshToken};accessToken=${accessToken}`)
      .send({ query })
      .expect(409)
  })

  it('should return 200 if nothing is changed', async () => {
    expect.hasAssertions()

    await userCollection.insertOne(fakeUser)
    query = query.replace('currency: BRL, email: "any_email@mail.com", name: "Any Name"', '')

    const response = await request(app)
      .post('/graphql')
      .set('Cookie', `refreshToken=${refreshToken};accessToken=${accessToken}`)
      .send({ query })

    expect(response.body).toStrictEqual({ data: { updateUser: { message: 'No changes were made' } } })
    expect(response.statusCode).toBe(200)
  })

  it('should return 200 if changes are made', async () => {
    expect.hasAssertions()

    await userCollection.insertOne(fakeUser)

    const response = await request(app)
      .post('/graphql')
      .set('Cookie', `refreshToken=${refreshToken};accessToken=${accessToken}`)
      .send({ query })

    expect(response.body).toStrictEqual({
      data: {
        updateUser: {
          user: {
            personal: { email: fakeUser.personal.email, id: fakeUser.personal.id, name: 'Any Name' },
            settings: { currency: fakeUser.settings.currency }
          }
        }
      }
    })
    expect(response.statusCode).toBe(200)
  })
})
