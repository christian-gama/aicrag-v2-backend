import { ITask, IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'

import { makeFakeTask, makeFakeUser } from '@/tests/__mocks__'

export default (): void =>
  describe('mongoAdapter', () => {
    const client = makeMongoDb()
    let collection: ICollectionMethods

    afterAll(async () => {
      await collection.deleteMany({})
    })

    beforeAll(async () => {
      collection = client.collection('users')
    })

    describe('collection', () => {
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
    })

    describe('aggregate', () => {
      it('should return an array of document if finds it', async () => {
        const fakeUser = makeFakeUser()
        const query = {}

        await collection.insertOne(fakeUser)

        const result = await collection.aggregate<IUser>(
          [
            {
              $match: { 'personal.name': fakeUser.personal.name }
            }
          ],
          query
        )

        expect(result).toStrictEqual({
          count: 1,
          displaying: 1,
          documents: [fakeUser],
          page: '1 of 1'
        })
      })

      it('should return an array of document if find using a complex pipeline', async () => {
        const fakeUser = makeFakeUser()
        const query = {}

        await collection.insertOne(fakeUser)

        const result = await collection.aggregate<any>(
          [
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
          ],
          query
        )

        expect(result.count).toBe(1)
        expect(result.displaying).toBe(1)
        expect(result.documents[0].personal.name).toBe(fakeUser.personal.name)
        expect(result.page).toBe('1 of 1')
      })

      it('should return an array of tasks if find using queries', async () => {
        const fakeUser = makeFakeUser()
        const fakeTask = makeFakeTask(fakeUser)
        const fakeTask2 = makeFakeTask(fakeUser)
        const fakeTask3 = makeFakeTask(fakeUser)
        const fakeTask4 = makeFakeTask(fakeUser)
        const query = { limit: '3', page: '1', sort: 'duration' }

        collection = client.collection('tasks')
        await collection.insertOne(fakeTask)
        await collection.insertOne(fakeTask2)
        await collection.insertOne(fakeTask3)
        await collection.insertOne(fakeTask4)

        const result = await collection.aggregate<ITask>(
          [
            {
              $match: {
                user: fakeTask.user
              }
            }
          ],
          query
        )

        expect(result.count).toBe(4)
        expect(result.displaying).toBe(3)
        expect(result.documents[0].duration).toBeLessThan(result.documents[1].duration)
        expect(result.page).toBe('1 of 2')
      })

      it('should return an empty array if does not find using a complex pipeline', async () => {
        const fakeUser = makeFakeUser()
        const query = {}

        await collection.insertOne(fakeUser)

        const result = await collection.aggregate<any>(
          [
            {
              $match: {
                $and: [
                  { 'logs.createdAt': { $lte: new Date(Date.now()) } },
                  { 'logs.createdAt': { $gte: new Date(Date.now() + 60 * 1000) } }
                ],
                'personal.name': fakeUser.personal.name
              }
            }
          ],
          query
        )

        expect(result).toStrictEqual({ count: 0, displaying: 0, documents: [], page: '1 of 0' })
      })

      it('should return an empty array if does not find it', async () => {
        const fakeUser = makeFakeUser()
        const query = {}

        const result = await collection.aggregate<IUser>(
          [
            {
              $match: { 'personal.name': fakeUser.personal.name }
            }
          ],
          query
        )

        expect(result.count).toBe(0)
        expect(result.displaying).toBe(0)
        expect(result.documents).toStrictEqual([])
        expect(result.page).toBe('1 of 0')
      })
    })

    describe('deleteMany', () => {
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
    })

    describe('deleteOne', () => {
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
    })

    describe('findAll', () => {
      it('should return a document without duration property', async () => {
        const fakeUser = makeFakeUser()
        const fakeTask = makeFakeTask(fakeUser)

        await collection.insertOne(fakeTask)

        const query = { fields: '-duration' }

        const result = await collection.findAll({ user: fakeUser.personal.id }, query)

        expect(result.documents[0]).not.toHaveProperty('duration')

        await collection.deleteMany({})
      })

      it('should return a document with only duration property', async () => {
        const fakeUser = makeFakeUser()
        const fakeTask = makeFakeTask(fakeUser)

        await collection.insertOne(fakeTask)

        const query = { fields: 'duration,-_id' }

        const result = await collection.findAll({ user: fakeUser.personal.id }, query)

        expect(Object.keys(result.documents[0])).toHaveLength(1)

        await collection.deleteMany({})
      })

      it('should return a sorted document', async () => {
        const fakeUser = makeFakeUser()
        const fakeTask = makeFakeTask(fakeUser)
        const fakeTask2 = makeFakeTask(fakeUser)
        const fakeTask3 = makeFakeTask(fakeUser)

        await collection.insertOne(fakeTask)
        await collection.insertOne(fakeTask2)
        await collection.insertOne(fakeTask3)

        const query = { fields: 'duration', sort: 'duration,-usd' }

        const result = await collection.findAll({ user: fakeUser.personal.id }, query)

        expect(result.documents[1].duration).toBeGreaterThanOrEqual(result.documents[0].duration)

        await collection.deleteMany({})
      })

      it('should return paginated document', async () => {
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

        const result = await collection.findAll({ user: fakeUser.personal.id }, query)

        expect(result.documents).toHaveLength(2)

        await collection.deleteMany({})
      })

      it('should return paginated document even without limit and page params', async () => {
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

        const result = await collection.findAll({ user: fakeUser.personal.id }, {})

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
          displaying: 2,
          documents: [insertedDoc, insertedDoc2],
          page: '1 of 1'
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
    })

    describe('findOne', () => {
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
    })

    describe('insertOne', () => {
      it('should return the inserted document', async () => {
        const fakeUser = makeFakeUser()

        const insertedUser = await collection.insertOne(fakeUser)

        expect(insertedUser.personal.id).toBe(fakeUser.personal.id)

        await collection.deleteMany({})
      })
    })

    describe('updateOne', () => {
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
  })
