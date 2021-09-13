import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'
import app from '@/main/config/app'
import { config } from '@/tests/config'
import { makeFakeValidAccount } from '@/tests/domain/__mocks__/account-mock'
import { makeFakeUser } from '@/tests/domain/__mocks__/user-mock'

import { Collection } from 'mongodb'
import request from 'supertest'
import { hash } from 'bcrypt'
import { adaptRoutes } from '@/main/adapters/express/adapt-routes'
import { makeSignUpController } from '@/main/factories/controllers/authentication/signup/signup-controller-factory'
import { makeLoginController } from '@/main/factories/controllers/authentication/login/login-controller-factory'
import { makeActivateAccountController } from '@/main/factories/controllers/authentication/activate-account/activate-account-controller-factory'

describe('Authentication routes', () => {
  let accountCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)

    app.use('/api/auth/activate-account', adaptRoutes(makeActivateAccountController()))
    app.use('/api/auth/signup', adaptRoutes(makeSignUpController()))
    app.use('/api/auth/login', adaptRoutes(makeLoginController()))
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    for (let i = 0; i < config.loopTimes; i++) {
      it('Should return 200 if all validations succeds', async () => {
        await request(app).post('/api/auth/signup').send(makeFakeValidAccount()).expect(200)
      })

      it('Should return 400 if validation fails', async () => {
        await request(app).post('/api/auth/signup').send({}).expect(400)
      })

      it('Should return 409 if email already exists', async () => {
        const fakeUser = makeFakeUser()
        const fakeAccount = {
          name: fakeUser.personal.name,
          email: fakeUser.personal.email,
          password: fakeUser.personal.password,
          passwordConfirmation: fakeUser.personal.password
        }
        await accountCollection.insertOne(fakeUser)

        await request(app).post('/api/auth/signup').send(fakeAccount).expect(409)
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

        await accountCollection.insertOne(fakeUser)

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

      it('Should return 403 if account is not active', async () => {
        const fakeUser = makeFakeUser()
        const hashedPassword = await hash(fakeUser.personal.password, 12)
        const userPassword = fakeUser.personal.password
        fakeUser.personal.password = hashedPassword

        await accountCollection.insertOne(fakeUser)

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

        await accountCollection.insertOne(fakeUser)

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

        await accountCollection.insertOne(fakeUser)

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

        await accountCollection.insertOne(fakeUser)

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

        await accountCollection.insertOne(fakeUser)

        await request(app)
          .post('/api/auth/activate-account')
          .send({ email: fakeUser.personal.email, activationCode: activationCode })
          .expect(401)
      })

      it('Should return 401 if misses any field', async () => {
        const fakeUser = makeFakeUser()
        const hashedPassword = await hash(fakeUser.personal.password, 12)
        fakeUser.personal.password = hashedPassword

        await accountCollection.insertOne(fakeUser)

        await request(app).post('/api/auth/activate-account').send().expect(401)
      })
    }
  })
})
