import { IUser } from '@/domain'

import { MailerServiceError } from '@/application/errors'

import { ICollectionMethods } from '@/infra/database/protocols'

import App from '@/main/express/config/app'
import { EmailPin } from '@/main/mailer'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'

import { makeFakeUser } from '@/tests/__mocks__'

import { Express } from 'express'
import request from 'supertest'

export default (): void =>
  describe('post /send-email-pin', () => {
    const client = makeMongoDb()
    let app: Express
    let fakeUser: IUser
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
    })

    it('should return 400 if validation fails', async () => {
      await userCollection.insertOne(fakeUser)

      const result = await request(app).post('/api/v1/mailer/send-email-pin').send({ email: 'invalid_email' })

      expect(result.status).toBe(400)
    })

    it('should return 400 if temp email does not exist', async () => {
      fakeUser.temporary.tempEmail = null
      await userCollection.insertOne(fakeUser)

      const result = await request(app).post('/api/v1/mailer/send-email-pin').send({ email: fakeUser.personal.email })

      expect(result.status).toBe(400)
    })

    it('should return 500 if email is not sent', async () => {
      fakeUser.temporary.tempEmail = 'any_email'
      await userCollection.insertOne(fakeUser)

      jest.spyOn(EmailPin.prototype, 'send').mockReturnValueOnce(Promise.resolve(new MailerServiceError()))

      const result = await request(app).post('/api/v1/mailer/send-email-pin').send({ email: fakeUser.personal.email })

      expect(result.status).toBe(500)
    })

    it('should return 200 if email is sent', async () => {
      fakeUser.temporary.tempEmail = 'any_email'
      await userCollection.insertOne(fakeUser)

      if (process.env.TEST_SEND_EMAIL !== 'true') {
        jest.spyOn(EmailPin.prototype, 'send').mockReturnValueOnce(Promise.resolve(true))
      }

      const result = await request(app).post('/api/v1/mailer/send-email-pin').send({ email: fakeUser.personal.email })

      expect(result.status).toBe(200)
    })
  })
