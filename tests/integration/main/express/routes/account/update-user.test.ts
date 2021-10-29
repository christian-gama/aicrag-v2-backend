import { IUser } from '@/domain'

import { ICollectionMethods } from '@/infra/database/protocols'

import App from '@/main/express/config/app'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import { makeGenerateRefreshToken, makeGenerateAccessToken } from '@/factories/providers/token'

import { makeFakeUser } from '@/tests/__mocks__'

import { Express } from 'express'
import request from 'supertest'

export default (): void =>
  describe('patch /update-user', () => {
    const client = makeMongoDb()
    let app: Express
    let accessToken: string
    let fakeUser: IUser
    let refreshToken: string
    let userCollection: ICollectionMethods

    afterEach(async () => {
      await userCollection.deleteMany({})
    })

    beforeAll(async () => {
      app = await App.setup()

      userCollection = client.collection('users')
    })

    beforeEach(async () => {
      fakeUser = makeFakeUser()
      accessToken = makeGenerateAccessToken().generate(fakeUser)
      refreshToken = await makeGenerateRefreshToken().generate(fakeUser)
    })

    it('should return 401 if user is not logged in', async () => {
      await userCollection.insertOne(fakeUser)

      const result = await request(app).patch('/api/v1/account/update-user').send()

      expect(result.status).toBe(401)
    })

    it('should return 400 if name is invalid', async () => {
      await userCollection.insertOne(fakeUser)

      const result = await request(app)
        .patch('/api/v1/account/update-user')
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ name: '1nv@lid_name' })

      expect(result.status).toBe(400)
    })

    it('should return 400 if currency is invalid', async () => {
      await userCollection.insertOne(fakeUser)

      const result = await request(app)
        .patch('/api/v1/account/update-user')
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ currency: 'invalid_currency' })

      expect(result.status).toBe(400)
    })

    it('should return 400 if email is invalid', async () => {
      await userCollection.insertOne(fakeUser)

      const result = await request(app)
        .patch('/api/v1/account/update-user')
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ email: 'invalid_email' })

      expect(result.status).toBe(400)
    })

    it('should return 409 if email already exists', async () => {
      await userCollection.insertOne(fakeUser)

      const result = await request(app)
        .patch('/api/v1/account/update-user')
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ email: fakeUser.personal.email })

      expect(result.status).toBe(409)
    })

    it('should return 200 if nothing is changed', async () => {
      await userCollection.insertOne(fakeUser)

      const result = await request(app)
        .patch('/api/v1/account/update-user')
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send()

      expect(result.status).toBe(200)
    })

    it('should return 200 if changes are made', async () => {
      await userCollection.insertOne(fakeUser)

      const result = await request(app)
        .patch('/api/v1/account/update-user')
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ currency: 'BRL', email: 'example@mail.com', name: 'Example' })

      expect(result.status).toBe(200)
    })
  })
