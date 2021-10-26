import { IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'

import { setupApp } from '@/main/express/config/app'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import { makeGenerateRefreshToken, makeGenerateAccessToken } from '@/factories/providers/token'

import { makeFakeUser } from '@/tests/__mocks__'

import { hash } from 'bcrypt'
import { Express } from 'express'
import request from 'supertest'

let app: Express

describe('mutation updatePassword', () => {
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
        updatePassword (input: { currentPassword: "${userPassword}", password: "new_password", passwordConfirmation: "new_password" }) {
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

  it('should return 401 if user is not logged in', async () => {
    expect.assertions(0)

    await request(app).post('/graphql').send({ query }).expect(401)
  })

  it('should return 400 if password is invalid', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    query = query.replace('new_password', '123')

    await request(app)
      .post('/graphql')
      .set('x-access-token', accessToken)
      .set('x-refresh-token', refreshToken)
      .send({
        query
      })
      .expect(400)
  })

  it('should return 400 if passwords are missing', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    query = query.replace(/new_password/g, '')

    await request(app)
      .post('/graphql')
      .set('x-access-token', accessToken)
      .set('x-refresh-token', refreshToken)
      .send({ query })
      .expect(400)
  })

  it('should return 400 if current password is wrong', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    query = query.replace(userPassword, 'invalid_password')

    await request(app)
      .post('/graphql')
      .set('x-access-token', accessToken)
      .set('x-refresh-token', refreshToken)
      .send({
        query
      })
      .expect(400)
  })

  it('should return 400 if password does not match passwordConfirmation', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    query = query.replace('new_password', 'new_password_2')

    await request(app)
      .post('/graphql')
      .set('x-access-token', accessToken)
      .set('x-refresh-token', refreshToken)
      .send({
        query
      })
      .expect(400)
  })

  it('should return 200 if succeeds', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await request(app)
      .post('/graphql')
      .set('x-access-token', accessToken)
      .set('x-refresh-token', refreshToken)
      .send({
        query
      })
      .expect(200)
  })
})
