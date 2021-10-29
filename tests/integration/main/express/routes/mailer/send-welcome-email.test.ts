import { IUser } from '@/domain'

import { MailerServiceError } from '@/application/errors'

import { ICollectionMethods } from '@/infra/database/protocols'

import App from '@/main/express/config/app'
import { WelcomeEmail } from '@/main/mailer/welcome-email'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'

import { makeFakeUser } from '@/tests/__mocks__'

import { Express } from 'express'
import request from 'supertest'

export default (): void =>
  describe('post /send-welcome-email', () => {
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

      const result = await request(app).post('/api/v1/mailer/send-welcome-email').send({ email: 'invalid_email' })

      expect(result.status).toBe(400)
    })

    it('should return 403 if account is already activated', async () => {
      fakeUser.settings.accountActivated = true
      await userCollection.insertOne(fakeUser)

      const result = await request(app)
        .post('/api/v1/mailer/send-welcome-email')
        .send({ email: fakeUser.personal.email })

      expect(result.status).toBe(403)
    })

    it('should return 500 if email is not sent', async () => {
      await userCollection.insertOne(fakeUser)

      jest.spyOn(WelcomeEmail.prototype, 'send').mockReturnValueOnce(Promise.resolve(new MailerServiceError()))

      const result = await request(app)
        .post('/api/v1/mailer/send-welcome-email')
        .send({ email: fakeUser.personal.email })

      expect(result.status).toBe(500)
    })

    it('should return 200 if email is sent', async () => {
      await userCollection.insertOne(fakeUser)

      if (process.env.TEST_SEND_EMAIL !== 'true') {
        jest.spyOn(WelcomeEmail.prototype, 'send').mockReturnValueOnce(Promise.resolve(true))
      }

      const result = await request(app)
        .post('/api/v1/mailer/send-welcome-email')
        .send({ email: fakeUser.personal.email })

      expect(result.status).toBe(200)
    })
  })
