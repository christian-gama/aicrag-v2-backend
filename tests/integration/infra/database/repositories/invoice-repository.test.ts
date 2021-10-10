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

  it('should return a result if finds one or more tasks', async () => {
    expect.hasAssertions()

    const { sut } = makeSut()
    const query = {}

    await taskCollection.insertOne(task)

    const result = await sut.getInvoiceByMonth(
      { month: task.date.month, taskId: task.taskId, userId: task.userId, year: task.date.year },
      query
    )

    expect(result).toStrictEqual({ count: 1, currentPage: 1, documents: [task], totalPages: 1 })
  })

  it('should return a result if finds one or more tasks with a query', async () => {
    expect.hasAssertions()

    const { fakeUser, sut } = makeSut()
    const query = { limit: '1', page: '1' }

    const fakeTask = makeFakeTask(fakeUser)
    const fakeTask2 = makeFakeTask(fakeUser)
    const fakeTask3 = makeFakeTask(fakeUser)
    fakeTask2.date = fakeTask.date
    fakeTask3.date = fakeTask.date

    await taskCollection.insertOne(fakeTask)
    await taskCollection.insertOne(fakeTask2)
    await taskCollection.insertOne(fakeTask3)

    const result = await sut.getInvoiceByMonth(
      { month: fakeTask.date.month, userId: fakeTask.userId, year: fakeTask.date.year },
      query
    )

    expect(result).toStrictEqual({ count: 3, currentPage: 1, documents: [fakeTask], totalPages: 3 })
  })

  it('should return a result if finds one or more tasks with a query and taskId', async () => {
    expect.hasAssertions()

    const { fakeUser, sut } = makeSut()
    const query = {}

    const fakeTask = makeFakeTask(fakeUser)
    const fakeTask2 = makeFakeTask(fakeUser)

    await taskCollection.insertOne(fakeTask)
    await taskCollection.insertOne(fakeTask2)

    const result = await sut.getInvoiceByMonth(
      {
        month: fakeTask.date.month,
        taskId: fakeTask.taskId,
        userId: fakeTask.userId,
        year: fakeTask.date.year
      },
      query
    )

    expect(result).toStrictEqual({ count: 1, currentPage: 1, documents: [fakeTask], totalPages: 1 })
  })
})
