import { IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'

import { environment } from '@/main/config/environment'
import App from '@/main/express/config/app'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import { makeGenerateAccessToken, makeGenerateRefreshToken } from '@/factories/providers/token'

import { makeFakeUser } from '@/tests/__mocks__'

import { Express } from 'express'
import request from 'supertest'

let app: Express

describe('query /verify-reset-password-token', () => {
  const client = makeMongoDb()
  let dbIsConnected = true
  let fakeUser: IUser
  let refreshToken: string
  let query: string
  let userCollection: ICollectionMethods

  afterAll(async () => {
    if (!dbIsConnected) await client.disconnect()
  })

  afterEach(async () => {
    await userCollection.deleteMany({})
  })

  beforeAll(async () => {
    dbIsConnected = MongoAdapter.client !== null
    if (!dbIsConnected) await MongoAdapter.connect(global.__MONGO_URI__)

    app = await App.setup()

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
    await userCollection.insertOne(fakeUser)

    await request(app)
      .post(environment.GRAPHQL.ENDPOINT)
      .set('x-refresh-token', refreshToken)
      .send({ query })
      .expect(403)
  })

  it('should return 401 if token is invalid', async () => {
    await request(app).post(environment.GRAPHQL.ENDPOINT).send({ query }).expect(401)
  })

  it("should return 401 if param's token does not match user's token", async () => {
    await userCollection.insertOne(fakeUser)

    const differentResetPasswordToken = makeGenerateAccessToken().generate(makeFakeUser())
    query = query.replace(fakeUser.temporary.resetPasswordToken as string, differentResetPasswordToken)

    await request(app).post(environment.GRAPHQL.ENDPOINT).send({ query }).expect(401)
  })

  it('should return 200 if token is valid', async () => {
    await userCollection.insertOne(fakeUser)

    await request(app).post(environment.GRAPHQL.ENDPOINT).send({ query }).expect(200)
  })
})
