import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'
import { fakeValidAccount } from '@/tests/domain/mocks/account-mock'
import { makeFakeUser } from '@/tests/domain/mocks/user-mock'

import { Collection } from 'mongodb'
import request from 'supertest'
import app from '@/main/config/app'
import { hash } from 'bcrypt'

let accountCollection: Collection
describe('Authentication routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('SignUp', () => {
    it('Should return 200 if all validations succeds', async () => {
      await request(app).post('/api/auth/signup').send(fakeValidAccount).expect(200)
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
  })

  describe('Login', () => {
    it('Should return 200 if all validations succeds', async () => {
      const fakeUser = makeFakeUser()
      const hashedPassword = await hash(fakeUser.personal.password, 12)
      const userPassword = fakeUser.personal.password
      fakeUser.personal.password = hashedPassword

      await accountCollection.insertOne(fakeUser)

      await request(app)
        .post('/api/auth/login')
        .send({ email: fakeUser.personal.email, password: userPassword })
        .expect(200)
    })
  })
})
