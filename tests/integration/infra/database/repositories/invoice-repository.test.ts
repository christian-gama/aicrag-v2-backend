import { ITask, ITaskData, IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { CollectionProtocol } from '@/infra/database/protocols'
import { InvoiceRepository } from '@/infra/database/repositories/invoice-repository'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'

import { makeFakeTask, makeFakeTaskData, makeFakeUser } from '@/tests/__mocks__'

interface SutTypes {
  fakeTask: ITask
  fakeTaskData: ITaskData
  fakeUser: IUser
  sut: InvoiceRepository
}

const makeSut = (): SutTypes => {
  const database = makeMongoDb()
  const fakeUser = makeFakeUser()
  const fakeTask = makeFakeTask(fakeUser)
  const fakeTaskData = makeFakeTaskData(fakeUser)

  const sut = new InvoiceRepository(database)

  return { fakeTask, fakeTaskData, fakeUser, sut }
}

describe('invoiceRepository', () => {
  const client = makeMongoDb()
  let task: ITask
  let taskCollection: CollectionProtocol

  afterAll(async () => {
    await client.disconnect()
  })

  afterEach(async () => {
    await taskCollection.deleteMany({})
  })

  beforeAll(async () => {
    await MongoAdapter.connect(global.__MONGO_URI__)

    taskCollection = client.collection('tasks')
  })

  beforeEach(async () => {
    const { fakeTask } = makeSut()

    task = fakeTask
  })

  describe('getAllInvoices', () => {
    it('should return a result if finds one or more tasks', async () => {
      expect.hasAssertions()

      const { sut } = makeSut()

      await taskCollection.insertOne(task)

      const query = {
        type: 'TX' as 'TX'
      }

      const result = await sut.getAllInvoices(query, task.userId)

      expect(result.count).toBe(1)
      expect(result.displaying).toBe(1)
      expect(result.documents[0].tasks).toBe(1)
      expect(result.documents[0].date.month).toBe(task.date.month)
      expect(result.documents[0].date.year).toBe(task.date.year)
      expect(result.documents[0].totalUsd).toBeCloseTo(Math.round(task.usd * 100) / 100, 1)
      expect(result.page).toBe('1 of 1')
    })

    it('should return a result from TX if find one or more tasks with a query', async () => {
      expect.hasAssertions()

      const { fakeUser, sut } = makeSut()

      const fakeTask = makeFakeTask(fakeUser)
      const fakeTask2 = makeFakeTask(fakeUser)
      const fakeTask3 = makeFakeTask(fakeUser)
      fakeTask2.date = fakeTask.date
      fakeTask3.date = fakeTask.date

      await taskCollection.insertOne(fakeTask)
      await taskCollection.insertOne(fakeTask2)
      await taskCollection.insertOne(fakeTask3)

      const query = {
        limit: '1',
        page: '1',
        type: 'TX' as 'TX'
      }

      const result = await sut.getAllInvoices(query, fakeUser.personal.id)

      expect(result.count).toBe(1)
      expect(result.displaying).toBe(1)
      expect(result.documents[0].tasks).toBe(3)
      expect(result.documents[0].date.month).toBe(fakeTask.date.month)
      expect(result.documents[0].date.year).toBe(fakeTask.date.year)
      expect(result.documents[0].totalUsd).toBeCloseTo(
        Math.round((fakeTask.usd + fakeTask2.usd + fakeTask3.usd) * 100) / 100, 1
      )
      expect(result.page).toBe('1 of 1')
    })
  })

  describe('getInvoiceByMonth', () => {
    it('should return a result if finds one or more tasks', async () => {
      expect.hasAssertions()

      const { sut } = makeSut()

      await taskCollection.insertOne(task)

      const query = {
        month: task.date.month.toString(),
        taskId: task.taskId,
        type: 'TX',
        year: task.date.year.toString()
      }

      const result = await sut.getInvoiceByMonth(query, task.userId)

      expect(result).toStrictEqual({ count: 1, displaying: 1, documents: [task], page: '1 of 1' })
    })

    it('should return a result if find one or more tasks with a query', async () => {
      expect.hasAssertions()

      const { fakeUser, sut } = makeSut()

      const fakeTask = makeFakeTask(fakeUser)
      const fakeTask2 = makeFakeTask(fakeUser)
      const fakeTask3 = makeFakeTask(fakeUser)
      fakeTask2.date = fakeTask.date
      fakeTask3.date = fakeTask.date

      await taskCollection.insertOne(fakeTask)
      await taskCollection.insertOne(fakeTask2)
      await taskCollection.insertOne(fakeTask3)

      const query = {
        limit: '1',
        month: fakeTask.date.month.toString(),
        page: '1',
        type: 'TX',
        year: fakeTask.date.year.toString()
      }

      const result = await sut.getInvoiceByMonth(query, fakeUser.personal.id)

      expect(result).toStrictEqual({
        count: 3,
        displaying: 1,
        documents: [fakeTask],
        page: '1 of 3'
      })
    })

    it('should return a result if finds one or more tasks with a query and taskId', async () => {
      expect.hasAssertions()

      const { fakeUser, sut } = makeSut()

      const fakeTask = makeFakeTask(fakeUser)
      const fakeTask2 = makeFakeTask(fakeUser)

      await taskCollection.insertOne(fakeTask)
      await taskCollection.insertOne(fakeTask2)

      const query = {
        month: fakeTask.date.month.toString(),
        taskId: fakeTask.taskId,
        type: 'TX',
        year: fakeTask.date.year.toString()
      }

      const result = await sut.getInvoiceByMonth(query, fakeTask.userId)

      expect(result).toStrictEqual({
        count: 1,
        displaying: 1,
        documents: [fakeTask],
        page: '1 of 1'
      })
    })
  })
})
