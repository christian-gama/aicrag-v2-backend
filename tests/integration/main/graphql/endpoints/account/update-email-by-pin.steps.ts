import { IUser } from '@/domain'

import { ICollectionMethods } from '@/infra/database/protocols'

import App from '@/main/express/config/app'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'

import { updateEmailByPinMutation } from '@/tests/helpers/queries'
import { userHelper } from '@/tests/helpers/user-helper'

import { Express } from 'express'
import { loadFeature, defineFeature } from 'jest-cucumber'
import path from 'path'
import request from 'supertest'

const feature = loadFeature(path.resolve(__dirname, 'update-email-by-pin.feature'))

export default (): void =>
  defineFeature(feature, (test) => {
    const client = makeMongoDb()
    let accessToken: string
    let app: Express
    let fakeUser: IUser
    let refreshToken: string
    let userCollection: ICollectionMethods
    let result: request.Response

    afterEach(async () => {
      await userCollection.deleteMany({})
    })

    beforeAll(async () => {
      app = await App.setup()

      userCollection = client.collection('users')
    })

    test('being logged out', ({ given, when, then, and }) => {
      given('The following temporaries:', async (table) => {
        fakeUser = await userHelper.insertUser(userCollection, {
          temporary: {
            tempEmail: table[0].tempEmail,
            tempEmailPin: table[0].tempEmailPin,
            tempEmailPinExpiration: new Date(Date.now() + 1000 * 60 * 60)
          }
        })
      })

      given('I am logged out', () => {
        accessToken = ''
        refreshToken = ''
      })

      when(/^I request to update my email using "(.*)"$/, async (emailPin) => {
        const query = updateEmailByPinMutation({ emailPin })

        result = await request(app)
          .post('/graphql')
          .set('x-access-token', accessToken)
          .set('x-refresh-token', refreshToken)
          .send({ query })
      })

      then(/^I should see an error that contains a message "(.*)"$/, (message) => {
        expect(result.body.errors[0].message).toBe(message)
      })

      and(/^I must receive a status code of (\d+)$/, (statusCode) => {
        expect(result.statusCode).toBe(+statusCode)
      })
    })

    test('using a temporary valid pin', ({ given, when, then, and }) => {
      given('The following temporaries:', async (table) => {
        fakeUser = await userHelper.insertUser(userCollection, {
          temporary: {
            tempEmail: table[0].tempEmail,
            tempEmailPin: table[0].tempEmailPin,
            tempEmailPinExpiration: new Date(Date.now() + 1000 * 60 * 60)
          }
        })
      })

      given('I am logged in', async () => {
        ;[accessToken, refreshToken] = await userHelper.generateToken(fakeUser)
      })

      when(/^I request to update my email using "(.*)"$/, async (emailPin) => {
        const query = updateEmailByPinMutation({ emailPin })

        result = await request(app)
          .post('/graphql')
          .set('x-access-token', accessToken)
          .set('x-refresh-token', refreshToken)
          .send({ query })
      })

      then('I should have my email updated', () => {
        expect(result.body.data.updateEmailByPin.user.personal.email).toBe('any_email@mail.com')
      })

      and('I should have my temporary email removed', async () => {
        fakeUser = (await userCollection.findOne({ 'personal.id': fakeUser.personal.id })) as IUser

        expect(fakeUser.temporary.tempEmail).toBeNull()
      })

      and(/^I must receive a status code of (\d+)$/, (statusCode) => {
        expect(result.statusCode).toBe(+statusCode)
      })
    })

    test('using a temporary invalid pin', ({ given, when, then, and }) => {
      given('The following temporaries:', async (table) => {
        fakeUser = await userHelper.insertUser(userCollection, {
          temporary: {
            tempEmail: table[0].tempEmail,
            tempEmailPin: table[0].tempEmailPin,
            tempEmailPinExpiration: new Date(Date.now() + 1000 * 60 * 60)
          }
        })
      })

      given('I am logged in', async () => {
        ;[accessToken, refreshToken] = await userHelper.generateToken(fakeUser)
      })

      when(/^I request to update my email using "(.*)"$/, async (emailPin) => {
        const query = updateEmailByPinMutation({ emailPin })

        result = await request(app)
          .post('/graphql')
          .set('x-access-token', accessToken)
          .set('x-refresh-token', refreshToken)
          .send({ query })
      })

      then(/^I should have receive an error that contains a message "(.*)"$/, (message) => {
        expect(result.body.errors[0].message).toBe(message)
      })

      and(/^I must receive a status code of (\d+)$/, (statusCode) => {
        expect(result.statusCode).toBe(+statusCode)
      })
    })
  })