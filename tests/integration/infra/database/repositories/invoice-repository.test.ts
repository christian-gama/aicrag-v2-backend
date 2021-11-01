import { ITask, ITaskData, IUser } from '@/domain'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'
import { InvoiceRepository } from '@/infra/database/repositories/invoice-repository'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'

import { makeFakeTask, makeFakeTaskData, makeFakeUser } from '@/tests/__mocks__'

import MockDate from 'mockdate'

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
  let dbIsConnected = true
  let task: ITask
  let taskCollection: ICollectionMethods

  afterAll(async () => {
    if (!dbIsConnected) await client.disconnect()
  })

  afterEach(() => {
    MockDate.reset()
  })

  beforeAll(async () => {
    dbIsConnected = MongoAdapter.client !== null
    if (!dbIsConnected) await MongoAdapter.connect(global.__MONGO_URI__)

    taskCollection = client.collection('tasks')
  })

  beforeEach(async () => {
    const { fakeTask } = makeSut()

    task = fakeTask
  })

  describe('getAll', () => {
    it('should return a result if finds one or more tasks', async () => {
      const { sut } = makeSut()

      await taskCollection.insertOne(task)

      const query = {
        type: 'TX' as 'TX'
      }

      const result = await sut.getAll(query, task.user)

      expect(result.count).toBe(1)
      expect(result.displaying).toBe(1)
      expect(result.documents[0].tasks).toBe(1)
      expect(result.documents[0].date.month).toBe(task.date.month)
      expect(result.documents[0].date.year).toBe(task.date.year)
      expect(result.documents[0].totalUsd).toBeCloseTo(Math.round(task.usd * 100) / 100, 1)
      expect(result.page).toBe('1 of 1')
    })

    it('should return a result from TX if find one or more tasks with a query', async () => {
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

      const result = await sut.getAll(query, fakeUser.personal.id)

      expect(result.count).toBe(1)
      expect(result.displaying).toBe(1)
      expect(result.documents[0].tasks).toBe(3)
      expect(result.documents[0].date.month).toBe(fakeTask.date.month)
      expect(result.documents[0].date.year).toBe(fakeTask.date.year)
      expect(result.documents[0].totalUsd).toBeCloseTo(
        Math.round((fakeTask.usd + fakeTask2.usd + fakeTask3.usd) * 100) / 100,
        1
      )
      expect(result.page).toBe('1 of 1')
    })
  })

  describe('getByMonth', () => {
    it('should return a result if finds one or more tasks', async () => {
      const { sut } = makeSut()

      await taskCollection.insertOne(task)

      const query = {
        month: task.date.month.toString(),
        taskId: task.taskId,
        type: 'TX' as 'TX',
        year: task.date.year.toString()
      }

      const result = await sut.getByMonth(query, task.user)

      expect(result).toStrictEqual({ count: 1, displaying: 1, documents: [task], page: '1 of 1' })
    })

    it('should return a result if find one or more tasks with a query', async () => {
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
        type: 'TX' as 'TX',
        year: fakeTask.date.year.toString()
      }

      const result = await sut.getByMonth(query, fakeUser.personal.id)

      expect(result).toStrictEqual({
        count: 3,
        displaying: 1,
        documents: [fakeTask],
        page: '1 of 3'
      })
    })

    it('should return a result if finds one or more tasks with a query and taskId', async () => {
      const { fakeUser, sut } = makeSut()

      const fakeTask = makeFakeTask(fakeUser)
      const fakeTask2 = makeFakeTask(fakeUser)

      await taskCollection.insertOne(fakeTask)
      await taskCollection.insertOne(fakeTask2)

      const query = {
        month: fakeTask.date.month.toString(),
        taskId: fakeTask.taskId,
        type: 'TX' as 'TX',
        year: fakeTask.date.year.toString()
      }

      const result = await sut.getByMonth(query, fakeTask.user)

      expect(result).toStrictEqual({
        count: 1,
        displaying: 1,
        documents: [fakeTask],
        page: '1 of 1'
      })
    })

    it('should return a result if finds one or more tasks with a query and period of today', async () => {
      MockDate.set(new Date('2020-01-15T12:00:00.000Z'))

      const { fakeUser, sut } = makeSut()

      const fakeTasks: ITask[] = []

      for (let i = 0; i < 2; i++) {
        const fakeTask = makeFakeTask(fakeUser)
        fakeTask.date.day = new Date().getUTCDate() - i
        fakeTasks.push(fakeTask)

        await taskCollection.insertOne(fakeTask)
      }

      // Remove the last task to make the test pass
      fakeTasks.pop()

      const query = {
        month: fakeTasks[0].date.month.toString(),
        period: 'today',
        type: 'TX' as 'TX',
        year: fakeTasks[0].date.year.toString()
      }

      const result = await sut.getByMonth(query, fakeTasks[0].user)

      expect(result).toStrictEqual({
        count: 1,
        displaying: 1,
        documents: fakeTasks,
        page: '1 of 1'
      })
    })

    it('should return a result if finds one or more tasks with a query and period of past 3 days', async () => {
      MockDate.set(new Date('2020-01-15T12:00:00.000Z'))

      const { fakeUser, sut } = makeSut()

      const fakeTasks: ITask[] = []

      for (let i = 0; i < 4; i++) {
        const fakeTask = makeFakeTask(fakeUser)
        fakeTask.date.full = new Date()
        fakeTask.date.month = new Date().getUTCMonth()
        fakeTask.date.year = new Date().getUTCFullYear()
        fakeTask.date.day = new Date().getUTCDate() - i
        fakeTask.date.hours = new Date().toLocaleTimeString('pt-br', { timeZone: 'UTC' })
        fakeTasks.push(fakeTask)

        await taskCollection.insertOne(fakeTask)
      }

      // Remove the last task to make the test pass
      fakeTasks.pop()

      const query = {
        month: fakeTasks[0].date.month.toString(),
        period: 'past_3_days',
        type: 'TX' as 'TX',
        year: fakeTasks[0].date.year.toString()
      }

      const result = await sut.getByMonth(query, fakeTasks[0].user)

      expect(result).toStrictEqual({
        count: 3,
        displaying: 3,
        documents: fakeTasks,
        page: '1 of 1'
      })
    })

    it('should return a result if finds one or more tasks with a query and period of past 7 days', async () => {
      MockDate.set(new Date('2020-01-15T12:00:00.000Z'))

      const { fakeUser, sut } = makeSut()

      const fakeTasks: ITask[] = []

      for (let i = 0; i < 8; i++) {
        const fakeTask = makeFakeTask(fakeUser)
        fakeTask.date.full = new Date()
        fakeTask.date.month = new Date().getUTCMonth()
        fakeTask.date.year = new Date().getUTCFullYear()
        fakeTask.date.day = new Date().getUTCDate() - i
        fakeTask.date.hours = new Date().toLocaleTimeString('pt-br', { timeZone: 'UTC' })
        fakeTasks.push(fakeTask)

        await taskCollection.insertOne(fakeTask)
      }

      // Remove the last task to make the test pass
      fakeTasks.pop()

      const query = {
        month: fakeTasks[0].date.month.toString(),
        period: 'past_7_days',
        type: 'TX' as 'TX',
        year: fakeTasks[0].date.year.toString()
      }

      const result = await sut.getByMonth(query, fakeTasks[0].user)

      expect(result).toStrictEqual({
        count: 7,
        displaying: 7,
        documents: fakeTasks,
        page: '1 of 1'
      })
    })

    it('should return a result if finds one or more tasks with operator and duration', async () => {
      MockDate.set(new Date('2020-01-15T12:00:00.000Z'))

      const { fakeUser, sut } = makeSut()

      const fakeTasks: ITask[] = []

      for (let i = 1; i <= 10; i++) {
        const fakeTask = makeFakeTask(fakeUser)
        fakeTask.duration = i
        fakeTask.date.full = new Date()
        fakeTask.date.month = new Date().getUTCMonth()
        fakeTask.date.year = new Date().getUTCFullYear()
        fakeTask.date.day = new Date().getUTCDate() - i
        fakeTask.date.hours = new Date().toLocaleTimeString('pt-br', { timeZone: 'UTC' })
        fakeTasks.push(fakeTask)

        await taskCollection.insertOne(fakeTask)
      }

      // Remove the last task to make the test pass
      fakeTasks.pop()

      const query = {
        duration: 9,
        month: fakeTasks[0].date.month.toString(),
        operator: 'lte' as 'lte',
        type: 'TX' as 'TX',
        year: fakeTasks[0].date.year.toString()
      }

      const result = await sut.getByMonth(query, fakeTasks[0].user)

      expect(result).toStrictEqual({
        count: 9,
        displaying: 9,
        documents: fakeTasks,
        page: '1 of 1'
      })
    })
  })
})
