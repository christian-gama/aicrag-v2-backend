import { IUser } from '@/domain'

import { ICollectionMethods } from '@/infra/database/protocols'

import App from '@/main/express/config/app'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import { makeGenerateAccessToken, makeGenerateRefreshToken } from '@/factories/providers/token'

import { makeFakeUser } from '@/tests/__mocks__'

import { Express } from 'express'
import request from 'supertest'

export default (): void =>
  describe('patch /update-email-by-pin', () => {
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
      fakeUser.temporary.tempEmail = 'any_email@mail.com'
      fakeUser.temporary.tempEmailPin = 'any_pin'
      fakeUser.temporary.tempEmailPinExpiration = new Date(Date.now() + 10 * 60 * 1000)
      accessToken = makeGenerateAccessToken().generate(fakeUser)
      refreshToken = await makeGenerateRefreshToken().generate(fakeUser)
    })

    it('should return 200 if all validations succeeds', async () => {
      const tempEmailPin = fakeUser.temporary.tempEmailPin

      await userCollection.insertOne(fakeUser)

      const result = await request(app)
        .patch('/api/v1/account/update-email-by-pin')
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ emailPin: tempEmailPin })

      expect(result.status).toBe(200)
    })

    it('should return 401 if user does not have access token', async () => {
      await userCollection.insertOne(fakeUser)

      const result = await request(app).patch('/api/v1/account/update-email-by-pin').send()

      expect(result.status).toBe(401)
    })

    it('should return 400 if code is invalid', async () => {
      await userCollection.insertOne(fakeUser)

      const result = await request(app)
        .patch('/api/v1/account/update-email-by-pin')
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ emailPin: 'invalid_pin' })

      expect(result.status).toBe(400)
    })

    it('should return 400 if pin is expired', async () => {
      const tempEmailPin = fakeUser.temporary.tempEmailPin
      fakeUser.temporary.tempEmailPinExpiration = new Date(Date.now() - 1000)

      await userCollection.insertOne(fakeUser)

      const result = await request(app)
        .patch('/api/v1/account/update-email-by-pin')
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ emailPin: tempEmailPin })

      expect(result.status).toBe(400)
    })

    it('should return 400 if misses any field', async () => {
      await userCollection.insertOne(fakeUser)

      const result = await request(app)
        .patch('/api/v1/account/update-email-by-pin')
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send()

      expect(result.status).toBe(400)
    })

    it('should return 400 if temporary email is null', async () => {
      fakeUser.temporary.tempEmail = null

      await userCollection.insertOne(fakeUser)

      const result = await request(app)
        .patch('/api/v1/account/update-email-by-pin')
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ emailPin: 'any_pin' })

      expect(result.status).toBe(400)
    })

    it('should return 400 if temporary email pin is null', async () => {
      fakeUser.temporary.tempEmailPin = null

      await userCollection.insertOne(fakeUser)

      const result = await request(app)
        .patch('/api/v1/account/update-email-by-pin')
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ emailPin: 'any_pin' })

      expect(result.status).toBe(400)
    })

    it('should return 400 if temporary email pin expiration is null', async () => {
      fakeUser.temporary.tempEmailPinExpiration = null

      await userCollection.insertOne(fakeUser)

      const result = await request(app)
        .patch('/api/v1/account/update-email-by-pin')
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ emailPin: 'any_pin' })

      expect(result.status).toBe(400)
    })
  })
