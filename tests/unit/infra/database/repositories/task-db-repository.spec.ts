import { ITask, ITaskData } from '@/domain'
import { TaskRepositoryProtocol } from '@/domain/repositories'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { CollectionProtocol } from '@/infra/database/protocols'
import { TaskDbRepository } from '@/infra/database/repositories'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'

import { makeFakeTask, makeFakeTaskData, makeTaskRepositoryStub } from '@/tests/__mocks__'

interface SutTypes {
  fakeTask: ITask
  fakeTaskData: ITaskData
  sut: TaskDbRepository
  taskRepository: TaskRepositoryProtocol
}

const makeSut = (): SutTypes => {
  const database = makeMongoDb()
  const fakeTask = makeFakeTask()
  const fakeTaskData = makeFakeTaskData()
  const taskRepository = makeTaskRepositoryStub(fakeTask)

  const sut = new TaskDbRepository(database, taskRepository)

  return { fakeTask, fakeTaskData, sut, taskRepository }
}

describe('taskDbRepository', () => {
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
    task = makeFakeTask()
    await taskCollection.insertOne(task)
  })

  describe('saveTask', () => {
    it('should return a task on success', async () => {
      expect.hasAssertions()

      const { fakeTask, fakeTaskData, sut } = makeSut()

      const task = await sut.saveTask(fakeTaskData)

      const { _id, ...obj } = task as any

      expect(typeof _id).toBe('object')
      expect(obj).toStrictEqual({
        commentary: fakeTask.commentary,
        date: {
          day: fakeTask.date.day,
          full: fakeTask.date.full,
          hours: fakeTask.date.hours,
          month: fakeTask.date.month,
          year: fakeTask.date.year
        },
        duration: fakeTask.duration,
        id: fakeTask.id,
        logs: {
          createdAt: fakeTask.logs.createdAt,
          updatedAt: fakeTask.logs.updatedAt
        },
        status: 'completed',
        taskId: fakeTask.taskId,
        type: fakeTask.type,
        user: fakeTask.user
      })
    })

    it('should call createTask with correct value', async () => {
      expect.hasAssertions()

      const { fakeTaskData, sut, taskRepository } = makeSut()
      const createTaskSpy = jest.spyOn(taskRepository, 'createTask')

      await sut.saveTask(fakeTaskData)

      expect(createTaskSpy).toHaveBeenCalledWith(fakeTaskData)
    })
  })

  describe('findTaskById', () => {
    it('should return a task if finds it', async () => {
      expect.hasAssertions()

      const { sut } = makeSut()

      const found = await sut.findTaskById(task.id, task.user)

      expect(found).toStrictEqual(task)
    })

    it('should return undefined if does not find a task', async () => {
      expect.hasAssertions()

      const { sut } = makeSut()

      const found = await sut.findTaskById('invalid_id', task.user)

      expect(found).toBeUndefined()
    })
  })
})
