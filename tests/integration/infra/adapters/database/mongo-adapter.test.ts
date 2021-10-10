/* eslint-disable jest/no-conditional-expect */
/* eslint-disable jest/prefer-expect-assertions */
import { IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { CollectionProtocol } from '@/infra/database/protocols'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'

import { makeFakeTask, makeFakeUser } from '@/tests/__mocks__'

describe('mongoAdapter', () => {
  const client = makeMongoDb()
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

      expect(error).toStrictEqual(new Error('Database is not connected'))
    }
  })

  it('should return collections methods', async () => {
    expect(collection).toHaveProperty('aggregate')
    expect(collection).toHaveProperty('deleteMany')
    expect(collection).toHaveProperty('deleteOne')
    expect(collection).toHaveProperty('findAll')
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

      expect(error).toStrictEqual(new Error('Database is not connected'))
    }
  })

  it('should return an array of document if finds it', async () => {
    const fakeUser = makeFakeUser()

    await collection.insertOne(fakeUser)

    const result = await collection.aggregate<IUser>([
      {
        $match: { 'personal.name': fakeUser.personal.name }
      }
    ])

    expect(result[0].personal.name).toBe(fakeUser.personal.name)
  })

  it('should return an array of document if finds using a complex pipeline', async () => {
    const fakeUser = makeFakeUser()

    await collection.insertOne(fakeUser)

    const result = await collection.aggregate<any>([
      {
        $match: {
          $and: [
            { 'logs.createdAt': { $lte: new Date(Date.now()) } },
            { 'logs.createdAt': { $gte: new Date(Date.now() - 60 * 1000) } }
          ],
          'personal.name': fakeUser.personal.name
        }
      },
      { $project: { _id: 0, logs: 1, personal: 1, settings: 1 } }
    ])

    expect(result[0]._id).toBeUndefined()
    expect(result[0].temporary).toBeUndefined()
    expect(result[0].logs).toBeDefined()
    expect(result[0].personal).toBeDefined()
    expect(result[0].settings).toBeDefined()
  })

  it('should return an empty array if does not finds using a complex pipeline', async () => {
    const fakeUser = makeFakeUser()

    await collection.insertOne(fakeUser)

    const result = await collection.aggregate<any>([
      {
        $match: {
          $and: [
            { 'logs.createdAt': { $lte: new Date(Date.now()) } },
            { 'logs.createdAt': { $gte: new Date(Date.now() + 60 * 1000) } }
          ],
          'personal.name': fakeUser.personal.name
        }
      }
    ])

    expect(result).toHaveLength(0)
  })

  it('should return an empty array if does not finds it', async () => {
    const fakeUser = makeFakeUser()

    const result = await collection.aggregate<IUser>([
      {
        $match: { 'personal.name': fakeUser.personal.name }
      }
    ])

    expect(result).toHaveLength(0)
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

  it('should return a document without duration property', async () => {
    expect.hasAssertions()

    const fakeUser = makeFakeUser()
    const fakeTask = makeFakeTask(fakeUser)

    await collection.insertOne(fakeTask)

    const query = { fields: '-duration' }

    const result = await collection.findAll({ userId: fakeUser.personal.id }, query)

    expect(result.documents[0]).not.toHaveProperty('duration')

    await collection.deleteMany({})
  })

  it('should return a document with only duration property', async () => {
    expect.hasAssertions()

    const fakeUser = makeFakeUser()
    const fakeTask = makeFakeTask(fakeUser)

    await collection.insertOne(fakeTask)

    const query = { fields: 'duration,-_id' }

    const result = await collection.findAll({ userId: fakeUser.personal.id }, query)

    expect(Object.keys(result.documents[0])).toHaveLength(1)

    await collection.deleteMany({})
  })

  it('should return a sorted document', async () => {
    expect.hasAssertions()

    const fakeUser = makeFakeUser()
    const fakeTask = makeFakeTask(fakeUser)
    const fakeTask2 = makeFakeTask(fakeUser)
    const fakeTask3 = makeFakeTask(fakeUser)

    await collection.insertOne(fakeTask)
    await collection.insertOne(fakeTask2)
    await collection.insertOne(fakeTask3)

    const query = { fields: 'duration', sort: 'duration,-usd' }

    const result = await collection.findAll({ userId: fakeUser.personal.id }, query)

    expect(result.documents[1].duration).toBeGreaterThanOrEqual(result.documents[0].duration)

    await collection.deleteMany({})
  })

  it('should return paginated document', async () => {
    expect.hasAssertions()

    const fakeUser = makeFakeUser()
    const fakeTask = makeFakeTask(fakeUser)
    const fakeTask2 = makeFakeTask(fakeUser)
    const fakeTask3 = makeFakeTask(fakeUser)
    const fakeTask4 = makeFakeTask(fakeUser)
    const fakeTask5 = makeFakeTask(fakeUser)
    const fakeTask6 = makeFakeTask(fakeUser)

    await collection.insertOne(fakeTask)
    await collection.insertOne(fakeTask2)
    await collection.insertOne(fakeTask3)
    await collection.insertOne(fakeTask4)
    await collection.insertOne(fakeTask5)
    await collection.insertOne(fakeTask6)

    const query = { limit: '2', page: '1' }

    const result = await collection.findAll({ userId: fakeUser.personal.id }, query)

    expect(result.documents).toHaveLength(2)

    await collection.deleteMany({})
  })

  it('should return paginated document even without limit and page params', async () => {
    expect.hasAssertions()

    const fakeUser = makeFakeUser()
    const fakeTask = makeFakeTask(fakeUser)
    const fakeTask2 = makeFakeTask(fakeUser)
    const fakeTask3 = makeFakeTask(fakeUser)
    const fakeTask4 = makeFakeTask(fakeUser)
    const fakeTask5 = makeFakeTask(fakeUser)
    const fakeTask6 = makeFakeTask(fakeUser)

    await collection.insertOne(fakeTask)
    await collection.insertOne(fakeTask2)
    await collection.insertOne(fakeTask3)
    await collection.insertOne(fakeTask4)
    await collection.insertOne(fakeTask5)
    await collection.insertOne(fakeTask6)

    const result = await collection.findAll({ userId: fakeUser.personal.id }, {})

    expect(result.documents).toHaveLength(6)

    await collection.deleteMany({})
  })

  it('should return a QueryResult with correct values', async () => {
    const fakeUser = makeFakeUser()
    const fakeTask = makeFakeTask(fakeUser)
    const fakeTask2 = makeFakeTask(fakeUser)

    const insertedDoc = await collection.insertOne(fakeTask)
    const insertedDoc2 = await collection.insertOne(fakeTask2)

    const result = await collection.findAll({}, {})

    expect(result).toStrictEqual({
      count: 2,
      currentPage: 1,
      documents: [insertedDoc, insertedDoc2],
      totalPages: 1
    })

    await collection.deleteMany({})
  })

  it('should return an array of length 0 if does not find a document', async () => {
    const fakeUser = makeFakeUser()
    await collection.insertOne({ any_field: 'any_value' })

    const result = await collection.findAll(fakeUser, {})

    expect(result.documents).toHaveLength(0)

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
