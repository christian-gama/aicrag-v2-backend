import { ITask, ITaskData, IUser } from '@/domain'
import { CreateTaskRepositoryProtocol } from '@/domain/repositories'

import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { CollectionProtocol } from '@/infra/database/protocols'
import { TaskRepository } from '@/infra/database/repositories'

import { makeMongoDb } from '@/factories/database/mongo-db-factory'

import {
  makeFakeTask,
  makeFakeTaskData,
  makeFakeUser,
  makeCreateTaskRepositoryStub
} from '@/tests/__mocks__'

interface SutTypes {
  createTaskRepository: CreateTaskRepositoryProtocol
  fakeTask: ITask
  fakeTaskData: ITaskData
  fakeUser: IUser
  sut: TaskRepository
}

const makeSut = (): SutTypes => {
  const database = makeMongoDb()
  const fakeUser = makeFakeUser()
  const fakeTask = makeFakeTask(fakeUser)
  const fakeTaskData = makeFakeTaskData(fakeUser)
  const createTaskRepository = makeCreateTaskRepositoryStub(fakeTask)

  const sut = new TaskRepository(createTaskRepository, database)

  return { createTaskRepository, fakeTask, fakeTaskData, fakeUser, sut }
}

describe('taskRepository', () => {
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

  it('should return true if delete a task', async () => {
    expect.hasAssertions()

    const { sut } = makeSut()

    const deleted = await sut.deleteTask(task.id, taskData.user.personal.id)

    expect(deleted).toBeTruthy()
  })

  it('should return false if does not delete a task', async () => {
    expect.hasAssertions()

    const { fakeTaskData, sut } = makeSut()

    const deleted = await sut.deleteTask('invalid_id', fakeTaskData.user.personal.id)

    expect(deleted).toBeFalsy()
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

    const { fakeTaskData, sut, createTaskRepository } = makeSut()
    const createTaskSpy = jest.spyOn(createTaskRepository, 'createTask')

    await sut.saveTask(fakeTaskData)

    expect(createTaskSpy).toHaveBeenCalledWith(fakeTaskData)
  })

  it('should return a result if finds one or more tasks', async () => {
    expect.hasAssertions()

    const { sut } = makeSut()

    const result = await sut.findAllTasks(taskData.user.personal.id, {})

    expect(result).toStrictEqual({ count: 1, displaying: 1, documents: [task], page: '1 of 1' })
  })

  it('should return a task if finds it', async () => {
    expect.hasAssertions()

    const { sut } = makeSut()

    const found = await sut.findTaskById(task.id, taskData.user.personal.id)

    expect(found).toStrictEqual(task)
  })

  it('should return null if does not find a task', async () => {
    expect.hasAssertions()

    const { fakeTaskData, sut } = makeSut()

    const found = await sut.findTaskById('invalid_id', fakeTaskData.user.personal.id)

    expect(found).toBeNull()
  })

  it('should return a task if finds a task by taskId', async () => {
    expect.hasAssertions()

    const { sut } = makeSut()

    const found = await sut.findTaskByTaskId(task.taskId, taskData.user.personal.id)

    expect(found).toStrictEqual(task)
  })

  it('should return null if does not find a task by taskId', async () => {
    expect.hasAssertions()

    const { fakeTaskData, sut } = makeSut()

    const found = await sut.findTaskByTaskId('invalid_id', fakeTaskData.user.personal.id)

    expect(found).toBeNull()
  })

  it('should return a task if updateTask finds a task', async () => {
    expect.hasAssertions()

    const { sut } = makeSut()

    const updatedTask = await sut.updateTask(task.id, { taskId: 'changed_task_id' })

    expect(updatedTask).toHaveProperty('_id')
  })

  it('should return a task with updated values', async () => {
    expect.hasAssertions()

    const { sut } = makeSut()

    const updatedTask = await sut.updateTask(task.id, { taskId: 'changed_task_id' })

    expect(updatedTask?.taskId).toBe('changed_task_id')
  })

  it('should return a task if pass multiple update properties', async () => {
    expect.hasAssertions()

    const { sut } = makeSut()

    const updatedTask = await sut.updateTask(task.id, {
      commentary: 'changed_commentary',
      taskId: 'changed_task_id'
    })

    expect(updatedTask?.commentary).toBe('changed_commentary')
    expect(updatedTask?.taskId).toBe('changed_task_id')
  })

  it('should return null if does not updateUser finds a user', async () => {
    expect.hasAssertions()

    const { fakeTask, sut } = makeSut()

    const updatedTask = await sut.updateTask(fakeTask.id, { commentary: 'changed_commentary' })

    expect(updatedTask).toBeNull()
  })
})
