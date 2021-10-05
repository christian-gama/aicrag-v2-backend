import { IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { CollectionProtocol } from '@/infra/database/protocols'

import app from '@/main/express/config/app'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import { makeGenerateRefreshToken, makeGenerateAccessToken } from '@/factories/providers/token'

import { makeFakeUser } from '@/tests/__mocks__'

import request from 'supertest'

describe('patch /update-user', () => {
  const client = makeMongoDb()
  let accessToken: string
  let fakeUser: IUser
  let refreshToken: string
  let userCollection: CollectionProtocol

  afterAll(async () => {
    await client.disconnect()
  })

  afterEach(async () => {
    await userCollection.deleteMany({})
  })

  beforeAll(async () => {
    await MongoAdapter.connect(global.__MONGO_URI__)

    userCollection = client.collection('users')
  })

  beforeEach(async () => {
    fakeUser = makeFakeUser()
    accessToken = makeGenerateAccessToken().generate(fakeUser)
    refreshToken = await makeGenerateRefreshToken().generate(fakeUser)
  })

  it('should return 401 if user is not logged in', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await request(app)
      .patch('/api/v1/account/update-user')
      .send()
      .expect(401)
  })

  it('should return 400 if name is invalid', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await request(app)
      .patch('/api/v1/account/update-user')
      .set('Cookie', `refreshToken=${refreshToken};accessToken=${accessToken}`)
      .send({ name: '1nv@lid_name' })
      .expect(400)
  })

  it('should return 400 if currency is invalid', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await request(app)
      .patch('/api/v1/account/update-user')
      .set('Cookie', `refreshToken=${refreshToken};accessToken=${accessToken}`)
      .send({ currency: 'invalid_currency' })
      .expect(400)
  })

  it('should return 400 if email is invalid', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await request(app)
      .patch('/api/v1/account/update-user')
      .set('Cookie', `refreshToken=${refreshToken};accessToken=${accessToken}`)
      .send({ email: 'invalid_email' })
      .expect(400)
  })

  it('should return 409 if email already exists', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await request(app)
      .patch('/api/v1/account/update-user')
      .set('Cookie', `refreshToken=${refreshToken};accessToken=${accessToken}`)
      .send({ email: fakeUser.personal.email })
      .expect(409)
  })

  it('should return 200 if nothing is changed', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await request(app)
      .patch('/api/v1/account/update-user')
      .set('Cookie', `refreshToken=${refreshToken};accessToken=${accessToken}`)
      .send()
      .expect(200)
  })

  it('should return 200 if changes are made', async () => {
    expect.assertions(0)

    await userCollection.insertOne(fakeUser)

    await request(app)
      .patch('/api/v1/account/update-user')
      .set('Cookie', `refreshToken=${refreshToken};accessToken=${accessToken}`)
      .send({ currency: 'BRL', email: 'example@mail.com', name: 'Example' })
      .expect(200)
  })
})
