import { IUser } from '@/domain'

import { ICollectionMethods } from '@/infra/database/protocols'

import App from '@/main/express/config/app'
import { partialProtectedMiddleware } from '@/main/express/routes'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import { makeGenerateAccessToken } from '@/factories/providers/token'

import { makeFakeUser } from '@/tests/__mocks__'

import { Express } from 'express'
import request from 'supertest'

export default (): void =>
  describe('partialProtectedMiddleware', () => {
    const client = makeMongoDb()
    let app: Express
    let accessToken: string
    let fakeUser: IUser
    let userCollection: ICollectionMethods

    beforeAll(async () => {
      app = await App.setup()

      userCollection = client.collection('users')

      app.get('/partial-protected', partialProtectedMiddleware, (req, res) => {
        res.send()
      })
    })

    beforeEach(async () => {
      fakeUser = makeFakeUser()
      accessToken = makeGenerateAccessToken().generate(fakeUser)
    })

    it('should return 401 if fails', async () => {
      const result = await request(app).get('/partial-protected')

      expect(result.status).toBe(401)
    })

    it('should return 200 if succeeds', async () => {
      await userCollection.insertOne(fakeUser)

      const result = await request(app).get('/partial-protected').set('x-access-token', accessToken)

      expect(result.status).toBe(200)
    })
  })
