import { IUser } from '@/domain'

import { ICollectionMethods } from '@/infra/database/protocols'

import App from '@/main/express/config/app'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import { makeGenerateAccessToken, makeGenerateRefreshToken } from '@/factories/providers/token'

import { makeFakeUser } from '@/tests/__mocks__'

import { Express } from 'express'
import request from 'supertest'

export default (): void =>
  describe('get /logout', () => {
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

    it('should return 200 if user is logged in', async () => {
      await userCollection.insertOne(fakeUser)

      const result = await request(app)
        .get('/api/v1/account/logout')
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)

      expect(result.status).toBe(200)
    })

    it('should return 401 if user is logged out', async () => {
      const result = await request(app).get('/api/v1/account/logout')

      expect(result.status).toBe(401)
    })
  })
