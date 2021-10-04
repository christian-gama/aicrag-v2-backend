/* eslint-disable jest/prefer-expect-assertions */
import { IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { CollectionProtocol } from '@/infra/database/protocols'

import { makeFakeUser } from '@/tests/__mocks__'

describe('mongoAdapter', () => {
  const client = new MongoAdapter()
  let collection: CollectionProtocol

  afterAll(async () => {
    await collection.deleteMany({})
    await client.disconnect()
  })

  beforeAll(async () => {
    await MongoAdapter.connect(global.__MONGO_URI__)
    collection = client.collection('users')
  })

  it('should be connected to database', async () => {
    expect(MongoAdapter.client).not.toBeNull()
  })

  it('should throw if database is not connected and call disconnect', async () => {
    const db = MongoAdapter.client

    try {
      MongoAdapter.client = null

      await client.disconnect()

      expect(true).toBeFalsy()
    } catch (error) {
      MongoAdapter.client = db

      // eslint-disable-next-line jest/no-conditional-expect
      expect(error).toStrictEqual(new Error('Database is not connected'))
    }
  })

  it('should return collections methods', async () => {
    expect(collection).toHaveProperty('deleteMany')
    expect(collection).toHaveProperty('deleteOne')
    expect(collection).toHaveProperty('findOne')
    expect(collection).toHaveProperty('insertOne')
    expect(collection).toHaveProperty('updateOne')
  })

  it('should throw if database is not connected and call collection', async () => {
    const db = MongoAdapter.client

    try {
      MongoAdapter.client = null

      client.collection('users')

      expect(true).toBeFalsy()
    } catch (error) {
      MongoAdapter.client = db

      // eslint-disable-next-line jest/no-conditional-expect
      expect(error).toStrictEqual(new Error('Database is not connected'))
    }
  })

  it('should return the deleted count greater than 0 if deletes a document', async () => {
    const fakeUser = makeFakeUser()

    await collection.insertOne(fakeUser)

    const deletedCount = await collection.deleteMany({ 'personal.id': fakeUser.personal.id })

    expect(deletedCount).toBeGreaterThan(0)
  })

  it('should return the deleted count equal to 0 if does not delete a document', async () => {
    const fakeUser = makeFakeUser()

    const deletedCount = await collection.deleteMany({ 'personal.id': fakeUser.personal.id })

    expect(deletedCount).toBe(0)

    await collection.deleteMany({})
  })

  it('should return true if deleted one document', async () => {
    const fakeUser = makeFakeUser()

    await collection.insertOne(fakeUser)

    const deleted = await collection.deleteOne({ 'personal.id': fakeUser.personal.id })

    expect(deleted).toBe(true)

    await collection.deleteMany({})
  })

  it('should return false if does not deleted a document', async () => {
    const fakeUser = makeFakeUser()

    const deleted = await collection.deleteOne({ 'personal.id': fakeUser.personal.id })

    expect(deleted).toBe(false)

    await collection.deleteMany({})
  })

  it('should return a document if found', async () => {
    const fakeUser = makeFakeUser()
    await collection.insertOne(fakeUser)

    const document = (await collection.findOne(fakeUser)) as IUser

    expect(document.personal.id).toBe(fakeUser.personal.id)

    await collection.deleteMany({})
  })

  it('should return null if does not find a document', async () => {
    const fakeUser = makeFakeUser()
    await collection.insertOne({ any_field: 'any_value' })

    const document = await collection.findOne(fakeUser)

    expect(document).toBeNull()

    await collection.deleteMany({})
  })

  it('should return the inserted document', async () => {
    const fakeUser = makeFakeUser()

    const insertedUser = await collection.insertOne(fakeUser)

    expect(insertedUser.personal.id).toBe(fakeUser.personal.id)

    await collection.deleteMany({})
  })

  it('should return the updated user', async () => {
    const fakeUser = makeFakeUser()
    await collection.insertOne(fakeUser)

    const updatedUser = (await collection.updateOne(fakeUser, {
      'personal.name': 'any_name'
    })) as IUser

    expect(updatedUser.personal.name).toBe('any_name')

    await collection.deleteMany({})
  })
})
