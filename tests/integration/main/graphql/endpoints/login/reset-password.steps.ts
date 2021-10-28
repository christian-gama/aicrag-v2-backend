import { IUser } from '@/domain'

import { ICollectionMethods } from '@/infra/database/protocols'

import { setupApp } from '@/main/express/config/app'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'
import { makeGenerateAccessToken } from '@/factories/providers/token'

import { makeFakeUser } from '@/tests/__mocks__'
import { resetPasswordMutation } from '@/tests/helpers/queries'
import { userHelper } from '@/tests/helpers/user-helper'

import { Express } from 'express'
import { loadFeature, defineFeature } from 'jest-cucumber'
import path from 'path'
import request from 'supertest'

const feature = loadFeature(path.resolve(__dirname, 'reset-password.feature'))

export const testResetPassword = (): void => {
  defineFeature(feature, (test) => {
    const client = makeMongoDb()
    let accessToken: string
    let app: Express
    let fakeUser: IUser
    let refreshToken: string
    let result: any
    let userCollection: ICollectionMethods

    afterEach(async () => {
      await userCollection.deleteMany({})
    })

    beforeAll(async () => {
      app = await setupApp()

      userCollection = client.collection('users')
    })

    test('being logged in', ({ given, when, then, and }) => {
      expect.hasAssertions()

      given('I am logged in', async () => {
        fakeUser = await userHelper.insertUser(userCollection)
        ;[accessToken, refreshToken] = await userHelper.generateToken(fakeUser)
      })

      when(/^I request to reset my password with my new password "(.*)"$/, async (password) => {
        const query = resetPasswordMutation({ password, passwordConfirmation: password })

        result = await request(app)
          .post('/graphql')
          .set('x-access-token', accessToken)
          .set('x-refresh-token', refreshToken)
          .send({ query })
      })

      then(/^I should receive an error message "(.*)"$/, (message) => {
        expect(result.body.errors[0].message).toBe(message)
      })

      and(/^I must receive a status code of (.*)$/, (statusCode) => {
        expect(result.status).toBe(parseInt(statusCode))
      })
    })

    test('using a valid input', ({ given, when, then, and }) => {
      expect.hasAssertions()

      given('I have a valid reset password token', async () => {
        fakeUser = makeFakeUser()
        const token = makeGenerateAccessToken().generate(fakeUser)
        fakeUser.temporary.resetPasswordToken = token
        await userCollection.insertOne(fakeUser)
        accessToken = token
      })

      given('I am logged out', async () => {
        refreshToken = ''
      })

      when(/^I request to reset my password with my new password "(.*)"$/, async (password) => {
        const query = resetPasswordMutation({ password, passwordConfirmation: password })

        result = await request(app)
          .post('/graphql')
          .set('x-access-token', accessToken)
          .set('x-refresh-token', refreshToken)
          .send({ query })
      })

      then('I should have my password changed', async () => {
        const user = (await userCollection.findOne({ 'personal.id': fakeUser.personal.id })) as IUser

        expect(user.personal.password).not.toBe(fakeUser.personal.password)
      })

      and(/^I must receive a status code of (.*)$/, (statusCode) => {
        expect(result.status).toBe(parseInt(statusCode))
      })
    })

    test('using an invalid input', ({ given, when, then, and }) => {
      expect.hasAssertions()

      given('I have a valid reset password token', async () => {
        fakeUser = makeFakeUser()
        const token = makeGenerateAccessToken().generate(fakeUser)
        fakeUser.temporary.resetPasswordToken = token
        await userCollection.insertOne(fakeUser)
        accessToken = token
      })

      given('I am logged out', () => {
        refreshToken = ''
      })

      when(/^I request to reset my password with my an invalid new password "(.*)"$/, async (password) => {
        const query = resetPasswordMutation({ password, passwordConfirmation: password })

        result = await request(app)
          .post('/graphql')
          .set('x-access-token', accessToken)
          .set('x-refresh-token', refreshToken)
          .send({ query })
      })

      then(/^I should receive an error message "(.*)"$/, (message) => {
        expect(result.body.errors[0].message).toBe(message)
      })

      and(/^I must receive a status code of (.*)$/, (statusCode) => {
        expect(result.status).toBe(parseInt(statusCode))
      })
    })

    test('using an invalid reset password token', ({ given, when, then, and }) => {
      expect.hasAssertions()

      given('I have an invalid reset password token', () => {
        fakeUser = makeFakeUser()
        const token = makeGenerateAccessToken().generate(fakeUser)
        fakeUser.temporary.resetPasswordToken = token
        accessToken = 'invalid_token'
      })

      given('I am logged out', () => {
        refreshToken = ''
      })

      when(/^I request to reset my password with my a valid new password "(.*)"$/, async (password) => {
        const query = resetPasswordMutation({ password, passwordConfirmation: password })

        result = await request(app)
          .post('/graphql')
          .set('x-access-token', accessToken)
          .set('x-refresh-token', refreshToken)
          .send({ query })
      })

      then(/^I should receive an error message "(.*)"$/, (message) => {
        expect(result.body.errors[0].message).toBe(message)
      })

      and(/^I must receive a status code of (.*)$/, (statusCode) => {
        expect(result.status).toBe(parseInt(statusCode))
      })
    })
  })
}
