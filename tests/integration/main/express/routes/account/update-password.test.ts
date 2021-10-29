import { IUser } from '@/domain'

import { ICollectionMethods } from '@/infra/database/protocols'

import App from '@/main/express/config/app'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import { makeGenerateRefreshToken, makeGenerateAccessToken } from '@/factories/providers/token'

import { makeFakeUser } from '@/tests/__mocks__'

import { hash } from 'bcrypt'
import { Express } from 'express'
import request from 'supertest'

export default (): void =>
  describe('patch /update-password', () => {
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
      const result = await request(app).patch('/api/v1/account/update-password').send()

      expect(result.status).toBe(401)
    })

    it('should return 400 if password is invalid', async () => {
      const hashedPassword = await hash(fakeUser.personal.password, 2)
      const userPassword = fakeUser.personal.password
      fakeUser.personal.password = hashedPassword
      await userCollection.insertOne(fakeUser)

      const result = await request(app)
        .patch('/api/v1/account/update-password')
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({
          currentPassword: userPassword,
          password: '123',
          passwordConfirmation: '123'
        })

      expect(result.status).toBe(400)
    })

    it('should return 400 if passwords are missing', async () => {
      await userCollection.insertOne(fakeUser)

      const result = await request(app)
        .patch('/api/v1/account/update-password')
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send()

      expect(result.status).toBe(400)
    })

    it('should return 400 if current password is wrong', async () => {
      const hashedPassword = await hash(fakeUser.personal.password, 2)
      fakeUser.personal.password = hashedPassword
      await userCollection.insertOne(fakeUser)

      const result = await request(app)
        .patch('/api/v1/account/update-password')
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({
          currentPassword: '123',
          password: '123456789',
          passwordConfirmation: '123456789'
        })

      expect(result.status).toBe(400)
    })

    it('should return 400 if password does not match passwordConfirmation', async () => {
      const hashedPassword = await hash(fakeUser.personal.password, 2)
      const userPassword = fakeUser.personal.password
      fakeUser.personal.password = hashedPassword
      await userCollection.insertOne(fakeUser)

      const result = await request(app)
        .patch('/api/v1/account/update-password')
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({
          currentPassword: userPassword,
          password: '123456789',
          passwordConfirmation: '1234567890'
        })

      expect(result.status).toBe(400)
    })

    it('should return 200 if succeeds', async () => {
      const hashedPassword = await hash(fakeUser.personal.password, 2)
      const userPassword = fakeUser.personal.password
      fakeUser.personal.password = hashedPassword
      await userCollection.insertOne(fakeUser)

      const result = await request(app)
        .patch('/api/v1/account/update-password')
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({
          currentPassword: userPassword,
          password: '123456789',
          passwordConfirmation: '123456789'
        })

      expect(result.status).toBe(200)
    })
  })
