import { IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'

import { setupApp } from '@/main/express/config/app'
import { updateEmailByCodeMutation } from '@/main/graphql/queries/mutations'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'

import { userHelper } from '@/tests/helpers/user-helper'

import { Express } from 'express'
import { loadFeature, defineFeature } from 'jest-cucumber'
import path from 'path'
import request from 'supertest'

const feature = loadFeature(path.resolve(__dirname, 'update-email-by-code.feature'))

defineFeature(feature, (test) => {
  const client = makeMongoDb()
  let accessToken: string
  let app: Express
  let fakeUser: IUser
  let refreshToken: string
  let userCollection: ICollectionMethods
  let response: request.Response

  afterAll(async () => {
    await client.disconnect()
  })

  afterEach(async () => {
    await userCollection.deleteMany({})
  })

  beforeAll(async () => {
    app = await setupApp()

    await MongoAdapter.connect(global.__MONGO_URI__)

    userCollection = client.collection('users')
  })

  test('requesting to update my email being logged out', ({ given, when, then, and }) => {
    expect.hasAssertions()

    given('I am logged out', async () => {
      accessToken = ''
      refreshToken = ''
    })

    when('I request to update my email', async () => {
      const query = updateEmailByCodeMutation('any_code')

      response = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then(/^I should see an error that contains a message "Token is missing"$/, () => {
      expect(response.body.errors[0].message).toBe('Token is missing')
    })

    and('I must receive a status code of 401', async () => {
      expect(response.statusCode).toBe(401)
    })
  })

  test('requesting to update my email using a temporary valid code', ({ given, when, then, and }) => {
    expect.hasAssertions()

    given('I am logged in', async () => {
      fakeUser = await userHelper.create(userCollection, {
        temporary: {
          tempEmail: 'any_email@mail.com',
          tempEmailCode: '12345',
          tempEmailCodeExpiration: new Date(Date.now() + 10 * 60 * 1000)
        }
      })
      ;[accessToken, refreshToken] = await userHelper.login(fakeUser)
    })

    when('I request to update my email', async () => {
      const query = updateEmailByCodeMutation('12345')

      response = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then('I should have my email updated', async () => {
      expect(response.body.data.updateEmailByCode.user.personal.email).toBe('any_email@mail.com')
    })

    and('I should have my temporary email removed', async () => {
      fakeUser = (await userCollection.findOne({ 'personal.id': fakeUser.personal.id })) as IUser

      expect(fakeUser.temporary.tempEmail).toBeNull()
    })

    and('I must receive a status code of 200', async () => {
      expect(response.statusCode).toBe(200)
    })
  })
})
