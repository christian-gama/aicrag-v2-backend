import { IUser } from '@/domain'

import { ICollectionMethods } from '@/infra/database/protocols'

import { environment } from '@/main/config/environment'
import App from '@/main/express/config/app'
import { RecoverPasswordEmail } from '@/main/mailer'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'

import { sendRecoverPasswordEmailMutation } from '@/tests/helpers/queries'
import { userHelper } from '@/tests/helpers/user-helper'

import { randomUUID } from 'crypto'
import { Express } from 'express'
import { loadFeature, defineFeature } from 'jest-cucumber'
import path from 'path'
import request from 'supertest'

const feature = loadFeature(path.resolve(__dirname, 'send-recover-password-email.feature'))

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
      app = await App.setup()

      userCollection = client.collection('users')
    })

    test('having a valid email', ({ given, when, then, and }) => {
      given(/^I have an account with the an email "(.*)" and a valid resetPasswordToken$/, async (email) => {
        fakeUser = await userHelper.insertUser(userCollection, {
          personal: {
            email,
            id: randomUUID(),
            name: 'any_name',
            password: 'any_password'
          },
          temporary: {
            resetPasswordToken: 'any_token'
          }
        })
      })

      when('I request to send an email using my existent email', async () => {
        const query = sendRecoverPasswordEmailMutation({ email: fakeUser.personal.email })

        if (process.env.TEST_SEND_EMAIL !== 'true') {
          jest.spyOn(RecoverPasswordEmail.prototype, 'send').mockReturnValueOnce(Promise.resolve(true))
        }

        result = await request(app).post(environment.GRAPHQL.ENDPOINT).send({ query })
      })

      then(/^I should receive a message "(.*)"$/, (message) => {
        expect(result.body.data.sendRecoverPasswordEmail.message).toBe(message)
      })

      and(/^I must receive a status code of (.*)$/, (statusCode) => {
        expect(result.status).toBe(parseInt(statusCode))
      })
    })

    test('having an invalid email', ({ given, when, then, and }) => {
      given(/^I have an account with the an email "(.*)" and a valid resetPasswordToken$/, async (email) => {
        fakeUser = await userHelper.insertUser(userCollection, {
          personal: {
            email,
            id: randomUUID(),
            name: 'any_name',
            password: 'any_password'
          },
          temporary: {
            resetPasswordToken: 'any_token'
          }
        })
      })

      when(/^I request to send an email using an invalid email "(.*)"$/, async (invalidEmail) => {
        const query = sendRecoverPasswordEmailMutation({ email: invalidEmail })

        result = await request(app).post(environment.GRAPHQL.ENDPOINT).send({ query })
      })

      then(/^I should receive an error message "(.*)"$/, (message) => {
        expect(result.body.errors[0].message).toBe(message)
      })

      and(/^I must receive a status code of (.*)$/, (statusCode) => {
        expect(result.status).toBe(parseInt(statusCode))
      })
    })

    test('having an invalid resetPasswordToken', ({ given, when, then, and }) => {
      given(/^I have an account with the an email "(.*)" and an invalid resetPasswordToken$/, async (email) => {
        fakeUser = await userHelper.insertUser(userCollection, {
          personal: {
            email,
            id: randomUUID(),
            name: 'any_name',
            password: 'any_password'
          },
          temporary: {
            resetPasswordToken: null
          }
        })
      })

      when('I request to send an email using my existent email', async () => {
        const query = sendRecoverPasswordEmailMutation({ email: fakeUser.personal.email })

        result = await request(app).post(environment.GRAPHQL.ENDPOINT).send({ query })
      })

      then(/^I should receive an error message "(.*)"$/, (message) => {
        expect(result.body.errors[0].message).toBe(message)
      })

      and(/^I must receive a status code of (.*)$/, (statusCode) => {
        expect(result.status).toBe(parseInt(statusCode))
      })
    })
  })
