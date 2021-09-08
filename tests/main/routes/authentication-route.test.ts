import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'
import { Collection } from 'mongodb'
import request from 'supertest'
import app from '@/main/config/app'
import { fakeValidAccount } from '@/tests/domain/mocks/account-mock'

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
  })
})
