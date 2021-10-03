import { IUser } from '@/domain'
import { UserRepositoryProtocol } from '@/domain/repositories'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { CollectionProtocol } from '@/infra/database/protocols'
import { UserDbRepository } from '@/infra/database/repositories'

import {
  makeFakeUser,
  makeUserRepositoryStub,
  makeFakeSignUpUserCredentials
} from '@/tests/__mocks__'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'

interface SutTypes {
  fakeUser: IUser
  sut: UserDbRepository
  userRepositoryStub: UserRepositoryProtocol
}

const makeSut = (): SutTypes => {
  const database = makeMongoDb()
  const fakeUser = makeFakeUser()
  const userRepositoryStub = makeUserRepositoryStub(fakeUser)

  const sut = new UserDbRepository(database, userRepositoryStub)

  return { fakeUser, sut, userRepositoryStub }
}

describe('userDbRepository', () => {
  const client = makeMongoDb()
  let user: IUser
  let userCollection: CollectionProtocol

  afterAll(async () => {
    await client.disconnect()
  })

  afterEach(async () => {
    await userCollection.deleteMany({})
  })

  beforeAll(async () => {
    await MongoAdapter.connect(global.__MONGO_URI__)

    userCollection = client.collection('users')
  })

  beforeEach(async () => {
    const { sut } = makeSut()

    user = await sut.saveUser(makeFakeSignUpUserCredentials())
  })

  describe('findUserByEmail', () => {
    it('should return a user if findUserByEmail finds a user', async () => {
      expect.hasAssertions()

      const { sut } = makeSut()
      const foundUser = await sut.findUserByEmail(user.personal.email)

      expect(foundUser).toHaveProperty('_id')
    })

    it('should return undefined if does not findUserByEmail finds a user', async () => {
      expect.hasAssertions()

      const { sut } = makeSut()
      const foundUser = await sut.findUserByEmail('non_existent@email.com')

      expect(foundUser).toBeUndefined()
    })
  })

  describe('findUserById', () => {
    it('should return a user if findUserById finds a user', async () => {
      expect.hasAssertions()

      const { sut } = makeSut()
      const foundUser = await sut.findUserById(user.personal.id)

      expect(foundUser).toHaveProperty('_id')
    })

    it('should return undefined if does not findUserById finds a user', async () => {
      expect.hasAssertions()

      const { sut } = makeSut()
      const foundUser = await sut.findUserById('invalid_id')

      expect(foundUser).toBeUndefined()
    })
  })

  describe('saveUser', () => {
    it('should return a user on success', async () => {
      expect.hasAssertions()

      const { fakeUser, sut } = makeSut()

      const user = await sut.saveUser(makeFakeSignUpUserCredentials())

      expect(user).toHaveProperty('_id')

      expect(user.logs).toStrictEqual({
        createdAt: fakeUser.logs.createdAt,
        lastLoginAt: fakeUser.logs.lastLoginAt,
        lastSeenAt: fakeUser.logs.lastSeenAt,
        updatedAt: fakeUser.logs.updatedAt
      })

      expect(user.personal).toStrictEqual({
        email: fakeUser.personal.email,
        id: fakeUser.personal.id,
        name: fakeUser.personal.name,
        password: fakeUser.personal.password
      })

      expect(user.settings).toStrictEqual({
        accountActivated: fakeUser.settings.accountActivated,
        currency: fakeUser.settings.currency,
        handicap: fakeUser.settings.handicap
      })

      expect(user.temporary).toStrictEqual({
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
    it('should return a user if updateUser finds a user', async () => {
      expect.hasAssertions()

      const { sut } = makeSut()

      const updatedUser = await sut.updateUser(user, { 'personal.name': 'changed_name' })

      expect(updatedUser).toHaveProperty('_id')
    })

    it('should return a user with updated values', async () => {
      expect.hasAssertions()

      const { sut } = makeSut()

      const updatedUser = await sut.updateUser(user, { 'personal.name': 'changed_name' })

      expect(updatedUser?.personal.name).toBe('changed_name')
    })

    it('should return a user if pass multiple update properties', async () => {
      expect.hasAssertions()

      const { sut } = makeSut()

      const updatedUser = await sut.updateUser(user, {
        'personal.email': 'changed_email',
        'personal.name': 'changed_name'
      })

      expect(updatedUser?.personal.name).toBe('changed_name')
      expect(updatedUser?.personal.email).toBe('changed_email')
    })

    it('should return undefined if does not updateUser finds a user', async () => {
      expect.hasAssertions()

      const { fakeUser, sut } = makeSut()

      const updatedUser = await sut.updateUser(fakeUser, { 'personal.name': 'any_name' })

      expect(updatedUser).toBeUndefined()
    })
  })
})
