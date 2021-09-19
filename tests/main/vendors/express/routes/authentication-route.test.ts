import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'
import app from '@/main/vendors/express/config/app'
import { controllerAdapter } from '@/main/vendors/express/adapters/controller-adapter'
import { makeSignUpController } from '@/main/factories/controllers/authentication/signup/signup-controller-factory'
import { makeLoginController } from '@/main/factories/controllers/authentication/login/login-controller-factory'
import { makeActivateAccountController } from '@/main/factories/controllers/authentication/activate-account/activate-account-controller-factory'
import { config } from '@/tests/config'
import { makeFakeUser } from '@/tests/__mocks__/domain/mock-user'
import { makeFakeSignUpUserCredentials } from '@/tests/__mocks__/domain/mock-signup-user-credentials'

import { Collection } from 'mongodb'
import request from 'supertest'
import { hash } from 'bcrypt'

describe('Authentication routes', () => {
  let userCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)

    app.use('/api/auth/activate-account', controllerAdapter(makeActivateAccountController()))
    app.use('/api/auth/signup', controllerAdapter(makeSignUpController()))
    app.use('/api/auth/login', controllerAdapter(makeLoginController()))
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    userCollection = await MongoHelper.getCollection('users')
    await userCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    for (let i = 0; i < config.loopTimes; i++) {
      it('Should return 200 if all validations succeds', async () => {
        await request(app).post('/api/auth/signup').send(makeFakeSignUpUserCredentials()).expect(200)
      })

      it('Should return 400 if validation fails', async () => {
        await request(app).post('/api/auth/signup').send({}).expect(400)
      })

      it('Should return 409 if email already exists', async () => {
        const fakeUser = makeFakeUser()
        const fakeSignUpUserCredentials = {
          name: fakeUser.personal.name,
          email: fakeUser.personal.email,
          password: fakeUser.personal.password,
          passwordConfirmation: fakeUser.personal.password
        }
        await userCollection.insertOne(fakeUser)

        await request(app).post('/api/auth/signup').send(fakeSignUpUserCredentials).expect(409)
      })

      it('Should return 400 if miss a param or param is invalid', async () => {
        await request(app).post('/api/auth/signup').send().expect(400)
      })
    }
  })

  describe('POST /login', () => {
    for (let i = 0; i < config.loopTimes; i++) {
      it('Should return 200 if all validations succeds', async () => {
        const fakeUser = makeFakeUser()
        const hashedPassword = await hash(fakeUser.personal.password, 12)
        const userPassword = fakeUser.personal.password
        fakeUser.personal.password = hashedPassword
        fakeUser.settings.accountActivated = true

        await userCollection.insertOne(fakeUser)

        await request(app)
          .post('/api/auth/login')
          .send({ email: fakeUser.personal.email, password: userPassword })
          .expect(200)
      })

      it('Should return 401 if credentials are invalid', async () => {
        await request(app)
          .post('/api/auth/login')
          .send({ email: 'invalid_email@email.com', password: 'invalid_password' })
          .expect(401)
      })

      it('Should return 403 if account is not activated', async () => {
        const fakeUser = makeFakeUser()
        const hashedPassword = await hash(fakeUser.personal.password, 12)
        const userPassword = fakeUser.personal.password
        fakeUser.personal.password = hashedPassword

        await userCollection.insertOne(fakeUser)

        await request(app)
          .post('/api/auth/login')
          .send({ email: fakeUser.personal.email, password: userPassword })
          .expect(403)
      })

      it('Should return 400 if miss a param or param is invalid', async () => {
        await request(app).post('/api/auth/login').send().expect(400)
      })
    }
  })

  describe('POST /activate-account', () => {
    for (let i = 0; i < config.loopTimes; i++) {
      it('Should return 200 if all validations succeds', async () => {
        const fakeUser = makeFakeUser()
        const hashedPassword = await hash(fakeUser.personal.password, 12)
        const activationCode = fakeUser.temporary.activationCode
        fakeUser.settings.accountActivated = false
        fakeUser.personal.password = hashedPassword

        await userCollection.insertOne(fakeUser)

        await request(app)
          .post('/api/auth/activate-account')
          .send({ email: fakeUser.personal.email, activationCode: activationCode })
          .expect(200)
      })

      it('Should return 401 if code is invalid', async () => {
        const fakeUser = makeFakeUser()
        const hashedPassword = await hash(fakeUser.personal.password, 12)
        fakeUser.settings.accountActivated = false
        fakeUser.personal.password = hashedPassword

        await userCollection.insertOne(fakeUser)

        await request(app)
          .post('/api/auth/activate-account')
          .send({ email: fakeUser.personal.email, activationCode: 'invalid_code' })
          .expect(401)
      })

      it('Should return 401 if code is expired', async () => {
        const fakeUser = makeFakeUser()
        const hashedPassword = await hash(fakeUser.personal.password, 12)
        const activationCode = fakeUser.temporary.activationCode
        if (fakeUser.temporary) { fakeUser.temporary.activationCodeExpiration = new Date(Date.now() - 1000) }
        fakeUser.settings.accountActivated = false
        fakeUser.personal.password = hashedPassword

        await userCollection.insertOne(fakeUser)

        await request(app)
          .post('/api/auth/activate-account')
          .send({ email: fakeUser.personal.email, activationCode: activationCode })
          .expect(401)
      })

      it('Should return 401 if account is already activated', async () => {
        const fakeUser = makeFakeUser()
        const hashedPassword = await hash(fakeUser.personal.password, 12)
        const activationCode = fakeUser.temporary.activationCode
        fakeUser.settings.accountActivated = true
        fakeUser.personal.password = hashedPassword

        await userCollection.insertOne(fakeUser)

        await request(app)
          .post('/api/auth/activate-account')
          .send({ email: fakeUser.personal.email, activationCode: activationCode })
          .expect(401)
      })

      it('Should return 401 if misses any field', async () => {
        const fakeUser = makeFakeUser()
        const hashedPassword = await hash(fakeUser.personal.password, 12)
        fakeUser.personal.password = hashedPassword

        await userCollection.insertOne(fakeUser)

        await request(app).post('/api/auth/activate-account').send().expect(401)
      })
    }
  })
})
