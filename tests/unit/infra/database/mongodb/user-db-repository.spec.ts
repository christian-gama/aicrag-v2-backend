import { IUser } from '@/domain'

import { UserRepositoryProtocol } from '@/application/protocols/repositories'

import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'
import { UserDbRepository } from '@/infra/database/mongodb/repositories'

import {
  makeFakeUser,
  makeUserRepositoryStub,
  makeFakeSignUpUserCredentials
} from '@/tests/__mocks__'

import { Collection } from 'mongodb'

interface SutTypes {
  sut: UserDbRepository
  fakeUser: IUser
  userRepositoryStub: UserRepositoryProtocol
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const userRepositoryStub = makeUserRepositoryStub(fakeUser)

  const sut = new UserDbRepository(userRepositoryStub)

  return { sut, fakeUser, userRepositoryStub }
}

describe('UserDbRepository', () => {
  let user: IUser
  let userCollection: Collection

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  afterEach(async () => {
    await userCollection.deleteMany({})
  })

  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)

    userCollection = MongoHelper.getCollection('users')
  })

  beforeEach(async () => {
    const { sut } = makeSut()

    user = await sut.saveUser(makeFakeSignUpUserCredentials())
  })

  describe('findUserByEmail', () => {
    it('Should return a user if findUserByEmail finds a user', async () => {
      const { sut } = makeSut()
      const foundUser = await sut.findUserByEmail(user.personal.email)

      expect(foundUser).toHaveProperty('_id')
    })

    it('Should return undefined if does not findUserByEmail finds a user', async () => {
      const { sut } = makeSut()
      const foundUser = await sut.findUserByEmail('non_existent@email.com')

      expect(foundUser).toBe(undefined)
    })
  })

  describe('findUserById', () => {
    it('Should return a user if findUserById finds a user', async () => {
      const { sut } = makeSut()
      const foundUser = await sut.findUserById(user.personal.id)

      expect(foundUser).toHaveProperty('_id')
    })

    it('Should return undefined if does not findUserById finds a user', async () => {
      const { sut } = makeSut()
      const foundUser = await sut.findUserById('invalid_id')

      expect(foundUser).toBe(undefined)
    })
  })

  describe('saveUser', () => {
    it('Should create a user on success', async () => {
      const { sut, fakeUser } = makeSut()
      const user = await sut.saveUser(makeFakeSignUpUserCredentials())

      expect(user).toHaveProperty('_id')

      expect(Object.keys(user.logs).length).toBe(4)
      expect(user.logs).toEqual({
        createdAt: fakeUser.logs.createdAt,
        lastLoginAt: fakeUser.logs.lastLoginAt,
        lastSeenAt: fakeUser.logs.lastSeenAt,
        updatedAt: fakeUser.logs.updatedAt
      })

      expect(Object.keys(user.personal).length).toBe(4)
      expect(user.personal).toEqual({
        email: fakeUser.personal.email,
        id: fakeUser.personal.id,
        name: fakeUser.personal.name,
        password: fakeUser.personal.password
      })

      expect(Object.keys(user.settings).length).toBe(3)
      expect(user.settings).toEqual({
        accountActivated: fakeUser.settings.accountActivated,
        currency: fakeUser.settings.currency,
        handicap: fakeUser.settings.handicap
      })

      expect(Object.keys(user.temporary).length).toBe(6)
      expect(user.temporary).toEqual({
        activationCode: fakeUser.temporary.activationCode,
        activationCodeExpiration: fakeUser.temporary.activationCodeExpiration,
        resetPasswordToken: fakeUser.temporary.resetPasswordToken,
        tempEmail: fakeUser.temporary.tempEmail,
        tempEmailCode: fakeUser.temporary.tempEmailCode,
        tempEmailCodeExpiration: fakeUser.temporary.tempEmailCodeExpiration
      })

      expect(user.tokenVersion).toBe(0)
    })
  })

  describe('updateUser', () => {
    it('Should return a user if updateUser finds a user', async () => {
      const { sut } = makeSut()

      const updatedUser = await sut.updateUser(user, { 'personal.name': 'changed_name' })

      expect(updatedUser).toHaveProperty('_id')
    })

    it('Should return a user with updated values', async () => {
      const { sut } = makeSut()

      const updatedUser = await sut.updateUser(user, { 'personal.name': 'changed_name' })

      expect(updatedUser?.personal.name).toBe('changed_name')
    })

    it('Should return a user if pass multiple update properties', async () => {
      const { sut } = makeSut()

      const updatedUser = await sut.updateUser(user, {
        'personal.name': 'changed_name',
        'personal.email': 'changed_email'
      })

      expect(updatedUser?.personal.name).toBe('changed_name')
      expect(updatedUser?.personal.email).toBe('changed_email')
    })

    it('Should return undefined if does not updateUser finds a user', async () => {
      const { sut, fakeUser } = makeSut()

      const updatedUser = await sut.updateUser(fakeUser, { 'personal.name': 'any_name' })

      expect(updatedUser).toBe(undefined)
    })
  })
})
