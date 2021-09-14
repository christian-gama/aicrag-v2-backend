import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'
import { env } from '@/main/config/env'
import { makeSut } from './user-db-repository-sut'
import { makeFakeSignUpUserCredentials } from '@/tests/__mocks__/domain/mock-signup-user-credentials'

import { Collection } from 'mongodb'
import { UpdateUserOptions } from '@/infra/database/mongodb/user/protocols/update-user-options'

describe('UserDbRepository', () => {
  let userCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(env.DB.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    userCollection = await MongoHelper.getCollection('users')
    await userCollection.deleteMany({})
  })

  describe('saveUser', () => {
    it('Should create a user on success', async () => {
      const { sut, fakeUser } = makeSut()
      const user = await sut.saveUser(makeFakeSignUpUserCredentials())

      expect(user).toHaveProperty('_id')

      expect(Object.keys(user.personal).length).toBe(4)
      expect(user.personal).toEqual({
        id: fakeUser.personal.id,
        name: fakeUser.personal.name,
        email: fakeUser.personal.email,
        password: fakeUser.personal.password
      })

      expect(Object.keys(user.settings).length).toBe(3)
      expect(user.settings).toEqual({
        accountActivated: fakeUser.settings.accountActivated,
        handicap: fakeUser.settings.handicap,
        currency: fakeUser.settings.currency
      })

      expect(Object.keys(user.logs).length).toBe(4)
      expect(user.logs).toEqual({
        createdAt: fakeUser.logs.createdAt,
        lastLoginAt: fakeUser.logs.lastLoginAt,
        lastSeenAt: fakeUser.logs.lastSeenAt,
        updatedAt: fakeUser.logs.updatedAt
      })

      expect(Object.keys(user.temporary).length).toBe(6)
      expect(user.temporary).toEqual({
        activationCode: fakeUser.temporary.activationCode,
        activationCodeExpiration: fakeUser.temporary.activationCodeExpiration,
        temporaryEmail: fakeUser.temporary.temporaryEmail,
        temporaryEmailExpiration: fakeUser.temporary.temporaryEmailExpiration,
        resetCode: fakeUser.temporary.resetCode,
        resetCodeExpiration: fakeUser.temporary.resetCodeExpiration
      })
    })
  })

  describe('findUserByEmail', () => {
    it('Should return a user if findUserByEmail finds a user', async () => {
      const { sut } = makeSut()
      const user = await sut.saveUser(makeFakeSignUpUserCredentials())
      const user2 = await sut.findUserByEmail(user.personal.email)

      expect(user2).toHaveProperty('_id')
    })

    it('Should return undefined if does not findUserByEmail finds a user', async () => {
      const { sut } = makeSut()
      const user = await sut.findUserByEmail('non_existent@email.com')

      expect(user).toBe(undefined)
    })
  })

  describe('updateUser', () => {
    it('Should return a user if updateUser finds a user', async () => {
      const { sut } = makeSut()
      const user = await sut.saveUser(makeFakeSignUpUserCredentials())

      const update: UpdateUserOptions = { 'personal.name': 'changed_name' }
      const user2 = await sut.updateUser(user, update)

      expect(user2).toHaveProperty('_id')
    })

    it('Should return a user with updated values', async () => {
      const { sut } = makeSut()
      const user = await sut.saveUser(makeFakeSignUpUserCredentials())

      const update: UpdateUserOptions = { 'personal.name': 'changed_name' }
      const user2 = await sut.updateUser(user, update)

      expect(user2?.personal.name).toBe('changed_name')
    })

    it('Should return a user if pass multiple update properties', async () => {
      const { sut } = makeSut()
      const user = await sut.saveUser(makeFakeSignUpUserCredentials())

      const update: UpdateUserOptions = {
        'personal.name': 'changed_name',
        'personal.email': 'changed_email'
      }
      const user2 = await sut.updateUser(user, update)

      expect(user2?.personal.name).toBe('changed_name')
      expect(user2?.personal.email).toBe('changed_email')
    })

    it('Should return undefined if does not updateUser finds a user', async () => {
      const { sut, fakeUser } = makeSut()

      const update: UpdateUserOptions = { 'personal.name': 'any_name' }
      const user = await sut.updateUser(fakeUser, update)

      expect(user).toBe(undefined)
    })
  })
})
