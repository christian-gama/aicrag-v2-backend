import { ITask, ITaskData, IUser } from '@/domain'
import { TaskRepositoryProtocol } from '@/domain/repositories'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { CollectionProtocol } from '@/infra/database/protocols'
import { TaskDbRepository } from '@/infra/database/repositories'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'

import {
  makeFakeTask,
  makeFakeTaskData,
  makeFakeUser,
  makeTaskRepositoryStub
} from '@/tests/__mocks__'

interface SutTypes {
  fakeTask: ITask
  fakeTaskData: ITaskData
  fakeUser: IUser
  sut: TaskDbRepository
  taskRepository: TaskRepositoryProtocol
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const database = makeMongoDb()
  const fakeTask = makeFakeTask(fakeUser)
  const fakeTaskData = makeFakeTaskData(fakeUser)
  const taskRepository = makeTaskRepositoryStub(fakeTask)

  const sut = new TaskDbRepository(database, taskRepository)

  return { fakeTask, fakeTaskData, fakeUser, sut, taskRepository }
}

describe('taskDbRepository', () => {
  const client = makeMongoDb()
  let task: ITask
  let taskData: ITaskData
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
    const { fakeTask, fakeTaskData } = makeSut()

    task = fakeTask
    taskData = fakeTaskData

    await taskCollection.insertOne(task)
  })

  it('should return a task on success', async () => {
    expect.hasAssertions()

    const { fakeTask, fakeTaskData, fakeUser, sut } = makeSut()

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
      usd: fakeTask.usd,
      userId: fakeUser.personal.id
    })
  })

  it('should call createTask with correct value', async () => {
    expect.hasAssertions()

    const { fakeTaskData, sut, taskRepository } = makeSut()
    const createTaskSpy = jest.spyOn(taskRepository, 'createTask')

    await sut.saveTask(fakeTaskData)

    expect(createTaskSpy).toHaveBeenCalledWith(fakeTaskData)
  })

  it('should return a task if finds it', async () => {
    expect.hasAssertions()

    const { sut } = makeSut()

    const found = await sut.findTaskById(task.id, taskData.user.personal.id)

    expect(found).toStrictEqual(task)
  })

  it('should return undefined if does not find a task', async () => {
    expect.hasAssertions()

    const { fakeTaskData, sut } = makeSut()

    const found = await sut.findTaskById('invalid_id', fakeTaskData.user.personal.id)

    expect(found).toBeUndefined()
  })

  it('should return a task if finds a task by taskId', async () => {
    expect.hasAssertions()

    const { sut } = makeSut()

    const found = await sut.findTaskByTaskId(task.taskId, taskData.user.personal.id)

    expect(found).toStrictEqual(task)
  })

  it('should return undefined if does not find a task by taskId', async () => {
    expect.hasAssertions()

    const { fakeTaskData, sut } = makeSut()

    const found = await sut.findTaskByTaskId('invalid_id', fakeTaskData.user.personal.id)

    expect(found).toBeUndefined()
  })
})
