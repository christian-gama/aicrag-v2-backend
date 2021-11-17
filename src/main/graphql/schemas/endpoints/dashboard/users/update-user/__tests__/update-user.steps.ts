import { IUser, IUserRole } from '@/domain'
import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'
import { environment } from '@/main/config/environment'
import App from '@/main/express/config/app'
import { makeMongoDb } from '@/main/factories/database/mongo-db-factory'
import { userHelper } from '@/tests/helpers/user-helper'
import { updateUserMutation } from './update-user-document'
import { randomUUID } from 'crypto'
import { Express } from 'express'
import { loadFeature, defineFeature } from 'jest-cucumber'
import { resolve } from 'path'
import request from 'supertest'

const feature = loadFeature(resolve(__dirname, 'update-user.feature'))

defineFeature(feature, (test) => {
  const client = makeMongoDb()
  let accessToken: string
  let app: Express
  let dbIsConnected = true
  let fakeUser: IUser
  let fakeUserToUpdate: IUser
  let refreshToken: string
  let result: any
  let userCollection: ICollectionMethods

  afterAll(async () => {
    if (!dbIsConnected) await client.disconnect()
  })

  afterEach(async () => {
    await userCollection.deleteMany({})
  })

  beforeAll(async () => {
    dbIsConnected = MongoAdapter.client !== null
    if (!dbIsConnected) await MongoAdapter.connect(global.__MONGO_URI__)

    app = await App.setup()

    userCollection = client.collection('users')
  })

  test('Being logged out', ({ given, when, then, and }) => {
    given('I am logged out', () => {
      accessToken = ''
      refreshToken = ''
    })

    when('I try to update a user', async () => {
      const query = updateUserMutation({ id: randomUUID() }, {})

      result = await request(app)
        .post(environment.GRAPHQL.ENDPOINT)
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then(/^I should receive an error with message "(.*)"$/, (message) => {
      expect(result.body.errors[0].message).toEqual(message)
    })

    and(/^I must receive a status code of (.*)$/, (statusCode) => {
      expect(result.status).toEqual(parseInt(statusCode))
    })
  })

  test('Being a common user', ({ given, when, then, and }) => {
    given('I am a common user', async () => {
      fakeUser = await userHelper.insertUser(userCollection)
      fakeUserToUpdate = await userHelper.insertUser(userCollection)
    })

    given('I am logged in', async () => {
      ;[accessToken, refreshToken] = await userHelper.generateToken(fakeUser)
    })

    when('I try to update a user', async () => {
      const query = updateUserMutation({ id: fakeUserToUpdate.personal.id }, {})

      result = await request(app)
        .post(environment.GRAPHQL.ENDPOINT)
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then(/^I should receive an error with message "(.*)"$/, (message) => {
      expect(result.body.errors[0].message).toEqual(message)
    })

    and(/^I must receive a status code of (.*)$/, (statusCode) => {
      expect(result.status).toEqual(parseInt(statusCode))
    })
  })

  test('Trying to update the administrators permission to a lower permission', ({ given, when, then, and }) => {
    given('I am an administrator', async () => {
      fakeUser = await userHelper.insertUser(userCollection, {
        settings: { role: IUserRole.administrator }
      })
    })

    given('I am logged in', async () => {
      ;[accessToken, refreshToken] = await userHelper.generateToken(fakeUser)
    })

    when('I try to update my perimssion to a lower permission', async () => {
      const query = updateUserMutation(
        { id: fakeUser.personal.id },
        {
          role: 'moderator'
        }
      )

      result = await request(app)
        .post(environment.GRAPHQL.ENDPOINT)
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then(/^I should receive an error with message "(.*)"$/, (message) => {
      expect(result.body.errors[0].message).toEqual(message)
    })

    and(/^I must receive a status code of (.*)$/, (statusCode) => {
      expect(result.status).toEqual(parseInt(statusCode))
    })
  })

  test('Updating a user being an administrator', ({ given, when, then, and }) => {
    given('I am an administrator', async () => {
      fakeUser = await userHelper.insertUser(userCollection, {
        settings: { role: IUserRole.administrator }
      })
    })

    given('I am logged in', async () => {
      ;[accessToken, refreshToken] = await userHelper.generateToken(fakeUser)
    })

    given('There is a user in the database', async () => {
      fakeUserToUpdate = await userHelper.insertUser(userCollection)
    })

    when('I try to update a user', async () => {
      const query = updateUserMutation(
        { id: fakeUserToUpdate.personal.id },
        {
          role: 'moderator'
        }
      )

      result = await request(app)
        .post(environment.GRAPHQL.ENDPOINT)
        .set('x-access-token', accessToken)
        .set('x-refresh-token', refreshToken)
        .send({ query })
    })

    then('The user should be updated', async () => {
      const user = (await userCollection.findOne({
        'personal.id': fakeUserToUpdate.personal.id
      })) as IUser

      expect(user.settings.role).toEqual(3)
    })

    and(/^I must receive a status code of (.*)$/, (statusCode) => {
      expect(result.status).toEqual(parseInt(statusCode))
    })
  })
})
