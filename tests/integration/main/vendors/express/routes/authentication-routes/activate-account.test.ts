import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'
import app from '@/main/vendors/express/config/app'
import { activateAccountController } from '@/main/vendors/express/routes'
import { makeFakeUser } from '@/tests/__mocks__'

import { hash } from 'bcrypt'
import request from 'supertest'
import { Collection } from 'mongodb'

describe('POST /activate-account', () => {
  let userCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)

    userCollection = MongoHelper.getCollection('users')

    app.post('/api/auth/activate-account', activateAccountController)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  afterEach(async () => {
    await userCollection.deleteMany({})
  })

  const agent = request.agent(app)

  it('Should return 200 if all validations succeds', async () => {
    const fakeUser = makeFakeUser()
    const hashedPassword = await hash(fakeUser.personal.password, 12)
    const activationCode = fakeUser.temporary.activationCode
    fakeUser.settings.accountActivated = false
    fakeUser.personal.password = hashedPassword

    await userCollection.insertOne(fakeUser)

    await agent
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

    await agent
      .post('/api/auth/activate-account')
      .send({ email: fakeUser.personal.email, activationCode: 'invalid_code' })
      .expect(401)
  })

  it('Should return 401 if code is expired', async () => {
    const fakeUser = makeFakeUser()
    const hashedPassword = await hash(fakeUser.personal.password, 12)
    const activationCode = fakeUser.temporary.activationCode
    if (fakeUser.temporary) {
      fakeUser.temporary.activationCodeExpiration = new Date(Date.now() - 1000)
    }
    fakeUser.settings.accountActivated = false
    fakeUser.personal.password = hashedPassword

    await userCollection.insertOne(fakeUser)

    await agent
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

    await agent
      .post('/api/auth/activate-account')
      .send({ email: fakeUser.personal.email, activationCode: activationCode })
      .expect(401)
  })

  it('Should return 401 if misses any field', async () => {
    const fakeUser = makeFakeUser()
    const hashedPassword = await hash(fakeUser.personal.password, 12)
    fakeUser.personal.password = hashedPassword

    await userCollection.insertOne(fakeUser)

    await agent.post('/api/auth/activate-account').send().expect(401)
  })
})
