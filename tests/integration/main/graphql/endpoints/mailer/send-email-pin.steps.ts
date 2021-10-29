import { IUser } from '@/domain'

import { ICollectionMethods } from '@/infra/database/protocols'

import { setupApp } from '@/main/express/config/app'
import { EmailPin } from '@/main/mailer'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'

import { sendEmailPinMutation } from '@/tests/helpers/queries'
import { userHelper } from '@/tests/helpers/user-helper'

import { Express } from 'express'
import { loadFeature, defineFeature } from 'jest-cucumber'
import path from 'path'
import request from 'supertest'

const feature = loadFeature(path.resolve(__dirname, 'send-email-pin.feature'))

export default (): void =>
  defineFeature(feature, (test) => {
    const client = makeMongoDb()
    let app: Express
    let fakeUser: IUser
    let result: any
    let userCollection: ICollectionMethods
    afterEach(async () => {
      await userCollection.deleteMany({})
    })

    beforeAll(async () => {
      app = await setupApp()

      userCollection = client.collection('users')
    })

    test('having a valid tempEmail', ({ given, when, then, and }) => {
      expect.hasAssertions()

      given('I have an account with the following credentials:', async (table) => {
        fakeUser = await userHelper.insertUser(userCollection, {
          temporary: {
            tempEmail: table[0].tempEmail,
            tempEmailPin: table[0].tempEmailPin
          }
        })
      })

      when('I request to send an email with my pin', async () => {
        const query = sendEmailPinMutation({ email: fakeUser.personal.email })

        if (process.env.TEST_SEND_EMAIL !== 'true') {
          jest.spyOn(EmailPin.prototype, 'send').mockReturnValueOnce(Promise.resolve(true))
        }

        result = await request(app).post('/graphql').send({ query })
      })

      then(/^I should receive a message "(.*)"$/, (message) => {
        expect(result.body.data.sendEmailPin.message).toBe(message)
      })

      and(/^I must receive a status code of (.*)$/, (statusCode) => {
        expect(result.status).toBe(parseInt(statusCode))
      })
    })

    test('having an invalid tempEmail', ({ given, when, then, and }) => {
      expect.hasAssertions()

      given('I have an account with the following credentials:', async (table) => {
        fakeUser = await userHelper.insertUser(userCollection, {
          temporary: {
            tempEmail: null,
            tempEmailPin: table[0].tempEmailPin
          }
        })
      })

      when('I request to send an email with my pin', async () => {
        const query = sendEmailPinMutation({ email: fakeUser.personal.email })

        if (process.env.TEST_SEND_EMAIL !== 'true') {
          jest.spyOn(EmailPin.prototype, 'send').mockReturnValueOnce(Promise.resolve(true))
        }

        result = await request(app).post('/graphql').send({ query })
      })

      then(/^I should receive an error message "(.*)"$/, (message) => {
        expect(result.body.errors[0].message).toBe(message)
      })

      and(/^I must receive a status code of (.*)$/, (statusCode) => {
        expect(result.status).toBe(parseInt(statusCode))
      })
    })
  })
