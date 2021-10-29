import { IUser } from '@/domain'
import { ICreateUserRepository } from '@/domain/repositories'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'
import { UserRepository } from '@/infra/database/repositories'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'

import { makeFakeUser, makeCreateUserRepositoryStub, makeFakeSignUpUserCredentials } from '@/tests/__mocks__'

interface SutTypes {
  createUserRepositoryStub: ICreateUserRepository
  fakeUser: IUser
  sut: UserRepository
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const createUserRepositoryStub = makeCreateUserRepositoryStub(fakeUser)
  const database = makeMongoDb()

  const sut = new UserRepository(createUserRepositoryStub, database)

  return { createUserRepositoryStub, fakeUser, sut }
}

describe('userRepository', () => {
  const client = makeMongoDb()
  let dbIsConnected = true
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

    userCollection = client.collection('users')
  })

  describe('findAllById', () => {
    it('should return a result if finds one or more users', async () => {
      const { sut } = makeSut()

      const user1 = await userCollection.insertOne(makeFakeUser())
      const user2 = await userCollection.insertOne(makeFakeUser())
      const user3 = await userCollection.insertOne(makeFakeUser())

      const result = await sut.findAllById([user1.personal.id, user2.personal.id, user3.personal.id], {})

      expect(result).toStrictEqual({ count: 3, displaying: 3, documents: [user1, user2, user3], page: '1 of 1' })
    })

    it('should return a result with empty documents if does not finds a user', async () => {
      const { sut } = makeSut()

      await userCollection.insertOne(makeFakeUser())
      await userCollection.insertOne(makeFakeUser())
      await userCollection.insertOne(makeFakeUser())

      const result = await sut.findAllById(['a', 'b', 'c'], {})

      expect(result).toStrictEqual({ count: 0, displaying: 0, documents: [], page: '1 of 0' })
    })
  })

  describe('findByEmail', () => {
    it('should return a user if findByEmail finds a user', async () => {
      const { sut } = makeSut()
      const user = await userCollection.insertOne(makeFakeUser())

      const foundUser = await sut.findByEmail(user.personal.email)

      expect(foundUser).toHaveProperty('_id')
    })

    it('should return null if does not findByEmail finds a user', async () => {
      const { sut } = makeSut()
      const foundUser = await sut.findByEmail('non_existent@email.com')

      expect(foundUser).toBeNull()
    })
  })

  describe('findById', () => {
    it('should return a user if findById finds a user', async () => {
      const { sut } = makeSut()
      const user = await userCollection.insertOne(makeFakeUser())

      const foundUser = await sut.findById(user.personal.id)

      expect(foundUser).toHaveProperty('_id')
    })

    it('should return null if does not findById finds a user', async () => {
      const { sut } = makeSut()

      const foundUser = await sut.findById('invalid_id')

      expect(foundUser).toBeNull()
    })
  })

  describe('save', () => {
    it('should return a user on success', async () => {
      const { fakeUser, sut } = makeSut()

      const user = await sut.save(makeFakeSignUpUserCredentials())

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
        activationPin: fakeUser.temporary.activationPin,
        activationPinExpiration: fakeUser.temporary.activationPinExpiration,
        resetPasswordToken: fakeUser.temporary.resetPasswordToken,
        tempEmail: fakeUser.temporary.tempEmail,
        tempEmailPin: fakeUser.temporary.tempEmailPin,
        tempEmailPinExpiration: fakeUser.temporary.tempEmailPinExpiration
      })

      expect(user.tokenVersion).toBe(0)
    })
  })

  describe('updateById', () => {
    it('should return a user if updateById finds a user', async () => {
      const { sut } = makeSut()
      const user = await userCollection.insertOne(makeFakeUser())

      const updatedUser = await sut.updateById<IUser>(user.personal.id, {
        'personal.name': 'changed_name'
      })

      expect(updatedUser).toHaveProperty('_id')
    })

    it('should return a user with updated values', async () => {
      const { sut } = makeSut()
      const user = await userCollection.insertOne(makeFakeUser())

      const updatedUser = await sut.updateById<IUser>(user.personal.id, {
        'personal.name': 'changed_name'
      })

      expect(updatedUser?.personal.name).toBe('changed_name')
    })

    it('should return a user if pass multiple update properties', async () => {
      const { sut } = makeSut()
      const user = await userCollection.insertOne(makeFakeUser())

      const updatedUser = await sut.updateById<IUser>(user.personal.id, {
        'personal.email': 'changed_email',
        'personal.name': 'changed_name'
      })

      expect(updatedUser?.personal.name).toBe('changed_name')
      expect(updatedUser?.personal.email).toBe('changed_email')
    })

    it('should return null if does not updateById finds a user', async () => {
      const { fakeUser, sut } = makeSut()

      const updatedUser = await sut.updateById<IUser>(fakeUser.personal.id, {
        'personal.name': 'any_name'
      })

      expect(updatedUser).toBeNull()
    })
  })
})
