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

describe('query /verify-reset-password-token', () => {
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
    refreshToken = await makeGenerateRefreshToken().generate(fakeUser)
    const resetPasswordToken = makeGenerateAccessToken().generate(fakeUser)
    fakeUser.temporary.resetPasswordToken = resetPasswordToken
    query = `
      query {
        verifyResetPasswordToken (param: { token: "${fakeUser.temporary.resetPasswordToken}" }) {
            accessToken
        }
      }
    `
  })

  it('should return 403 if user is logged in', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await request(app).post('/graphql').set('Cookie', `refreshToken=${refreshToken}`).send({ query }).expect(403)
  })

  it('should return 401 if token is invalid', async () => {
    expect.assertions(0)

    await request(app).post('/graphql').send({ query }).expect(401)
  })

  it("should return 401 if param's token does not match user's token", async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    const differentResetPasswordToken = makeGenerateAccessToken().generate(makeFakeUser())
    query = query.replace(fakeUser.temporary.resetPasswordToken as string, differentResetPasswordToken)

    await request(app).post('/graphql').send({ query }).expect(401)
  })

  it('should return 200 if token is valid', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await request(app).post('/graphql').send({ query }).expect(200)
  })
})
