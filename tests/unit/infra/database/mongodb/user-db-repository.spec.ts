import { UserRepositoryProtocol } from '@/application/protocols/repositories'
import { IUser } from '@/domain'
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
  let userCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    userCollection = MongoHelper.getCollection('users')
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
        resetPasswordToken: fakeUser.temporary.resetPasswordToken,
        tempEmail: fakeUser.temporary.tempEmail,
        tempEmailCode: fakeUser.temporary.tempEmailCode,
        tempEmailCodeExpiration: fakeUser.temporary.tempEmailCodeExpiration
      })

      expect(user.tokenVersion).toBe(0)
    })
  })

  describe('findUserByEmail', () => {
    it('Should return a user if findUserByEmail finds a user', async () => {
      const { sut } = makeSut()
      const savedUser = await sut.saveUser(makeFakeSignUpUserCredentials())
      const user = await sut.findUserByEmail(savedUser.personal.email)

      expect(user).toHaveProperty('_id')
    })

    it('Should return undefined if does not findUserByEmail finds a user', async () => {
      const { sut } = makeSut()
      const user = await sut.findUserByEmail('non_existent@email.com')

      expect(user).toBe(undefined)
    })
  })

  describe('findUserById', () => {
    it('Should return a user if findUserById finds a user', async () => {
      const { sut } = makeSut()
      const savedUser = await sut.saveUser(makeFakeSignUpUserCredentials())
      const user = await sut.findUserById(savedUser.personal.id)

      expect(user).toHaveProperty('_id')
    })

    it('Should return undefined if does not findUserById finds a user', async () => {
      const { sut } = makeSut()
      const user = await sut.findUserById('invalid_id')

      expect(user).toBe(undefined)
    })
  })

  describe('updateUser', () => {
    it('Should return a user if updateUser finds a user', async () => {
      const { sut } = makeSut()
      const user = await sut.saveUser(makeFakeSignUpUserCredentials())

      const user2 = await sut.updateUser(user, { 'personal.name': 'changed_name' })

      expect(user2).toHaveProperty('_id')
    })

    it('Should return a user with updated values', async () => {
      const { sut } = makeSut()
      const user = await sut.saveUser(makeFakeSignUpUserCredentials())

      const user2 = await sut.updateUser(user, { 'personal.name': 'changed_name' })

      expect(user2?.personal.name).toBe('changed_name')
    })

    it('Should return a user if pass multiple update properties', async () => {
      const { sut } = makeSut()
      const user = await sut.saveUser(makeFakeSignUpUserCredentials())

      const user2 = await sut.updateUser(user, {
        'personal.name': 'changed_name',
        'personal.email': 'changed_email'
      })

      expect(user2?.personal.name).toBe('changed_name')
      expect(user2?.personal.email).toBe('changed_email')
    })

    it('Should return undefined if does not updateUser finds a user', async () => {
      const { sut, fakeUser } = makeSut()

      const user = await sut.updateUser(fakeUser, { 'personal.name': 'any_name' })

      expect(user).toBe(undefined)
    })
  })
})