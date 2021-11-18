import { ITask, ITaskData, IUser } from '@/domain'
import { ICreateTaskRepository } from '@/domain/repositories'
import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { ICollectionMethods } from '@/infra/database/protocols'
import { TaskRepository } from '@/infra/database/repositories'
import { makeMongoDb } from '@/main/factories/database/mongo-db-factory'
import { makeFakeTask, makeFakeTaskData, makeFakeUser, makeCreateTaskRepositoryStub } from '@/tests/__mocks__'

interface SutTypes {
  createTaskRepository: ICreateTaskRepository
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
  let dbIsConnected = true
  let task: ITask
  let taskData: ITaskData
  let taskCollection: ICollectionMethods

  afterAll(async () => {
    if (!dbIsConnected) await client.disconnect()
  })

  afterEach(async () => {
    await taskCollection.deleteMany({})
  })

  beforeAll(async () => {
    dbIsConnected = MongoAdapter.client !== null
    if (!dbIsConnected) await MongoAdapter.connect(global.__MONGO_URI__)

    taskCollection = client.collection('tasks')
  })

  beforeEach(async () => {
    const { fakeTask, fakeTaskData } = makeSut()

    task = fakeTask
    taskData = fakeTaskData

    await taskCollection.insertOne(task)
  })

  describe('deleteManyByUserId', () => {
    it('should return a count greater than 0 if delete one or more task', async () => {
      const { sut } = makeSut()

      const result = await sut.deleteManyByUserId(task.user)

      expect(result).toBeGreaterThan(0)
    })

    it('should return a count equal to 0 if does not delete a task', async () => {
      const { sut } = makeSut()

      const result = await sut.deleteManyByUserId('invalid_id')

      expect(result).toBe(0)
    })
  })

  describe('deleteById', () => {
    it('should return true if delete a task', async () => {
      const { sut } = makeSut()

      const deleted = await sut.deleteById(task.id, taskData.user.personal.id)

      expect(deleted).toBeTruthy()
    })

    it('should return false if does not delete a task', async () => {
      const { fakeTaskData, sut } = makeSut()

      const deleted = await sut.deleteById('invalid_id', fakeTaskData.user.personal.id)

      expect(deleted).toBeFalsy()
    })
  })

  describe('save', () => {
    it('should return a task on success', async () => {
      const { fakeTask, fakeTaskData, fakeUser, sut } = makeSut()

      const task = await sut.save(fakeTaskData)

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
        user: fakeUser.personal.id
      })
    })

    it('should call create with correct value', async () => {
      const { fakeTaskData, sut, createTaskRepository } = makeSut()
      const createTaskSpy = jest.spyOn(createTaskRepository, 'create')

      await sut.save(fakeTaskData)

      expect(createTaskSpy).toHaveBeenCalledWith(fakeTaskData)
    })
  })

  describe('findAll', () => {
    it('should return a result if finds one or more tasks', async () => {
      const { sut } = makeSut()

      const result = await sut.findAll(taskData.user.personal.id, {})

      expect(result).toStrictEqual({ count: 1, displaying: 1, documents: [task], page: '1 of 1' })
    })
  })

  describe('findById', () => {
    it('should return a task if finds it', async () => {
      const { sut } = makeSut()

      const found = await sut.findById(task.id, taskData.user.personal.id)

      expect(found).toStrictEqual(task)
    })

    it('should return null if does not find a task', async () => {
      const { fakeTaskData, sut } = makeSut()

      const found = await sut.findById('invalid_id', fakeTaskData.user.personal.id)

      expect(found).toBeNull()
    })
  })

  describe('superFindById', () => {
    it('should return a task if finds it', async () => {
      const { sut } = makeSut()

      const found = await sut.superFindById(task.id)

      expect(found).toStrictEqual(task)
    })

    it('should return null if does not find a task', async () => {
      const { sut } = makeSut()

      const found = await sut.superFindById('invalid_id')

      expect(found).toBeNull()
    })
  })

  describe('findByTaskId', () => {
    it('should return a task if finds a task by taskId', async () => {
      const { sut } = makeSut()

      const found = await sut.findByTaskId(task.taskId, taskData.user.personal.id)

      expect(found).toStrictEqual(task)
    })

    it('should return null if does not find a task by taskId', async () => {
      const { fakeTaskData, sut } = makeSut()

      const found = await sut.findByTaskId('invalid_id', fakeTaskData.user.personal.id)

      expect(found).toBeNull()
    })
  })

  describe('updateById', () => {
    it('should return a task if updateById finds a task', async () => {
      const { sut } = makeSut()

      const updatedTask = await sut.updateById(task.id, task.user, { taskId: 'changed_task_id' })

      expect(updatedTask).toHaveProperty('_id')
    })

    it('should return a task with updated values', async () => {
      const { sut } = makeSut()

      const updatedTask = await sut.updateById(task.id, task.user, { taskId: 'changed_task_id' })

      expect(updatedTask?.taskId).toBe('changed_task_id')
    })

    it('should return a task if pass multiple update properties', async () => {
      const { sut } = makeSut()

      const updatedTask = await sut.updateById(task.id, task.user, {
        commentary: 'changed_commentary',
        taskId: 'changed_task_id'
      })

      expect(updatedTask?.commentary).toBe('changed_commentary')
      expect(updatedTask?.taskId).toBe('changed_task_id')
    })

    it('should return null if does not updateById finds a user', async () => {
      const { fakeTask, sut } = makeSut()

      const updatedTask = await sut.updateById(fakeTask.id, fakeTask.user, { commentary: 'changed_commentary' })

      expect(updatedTask).toBeNull()
    })
  })

  describe('superUpdateById', () => {
    it('should return a task if superUpdateById finds a task', async () => {
      const { sut } = makeSut()

      const updatedTask = await sut.superUpdateById(task.id, { taskId: 'changed_task_id' })

      expect(updatedTask).toHaveProperty('_id')
    })

    it('should return a task with updated values', async () => {
      const { sut } = makeSut()

      const updatedTask = await sut.superUpdateById(task.id, { taskId: 'changed_task_id' })

      expect(updatedTask?.taskId).toBe('changed_task_id')
    })

    it('should return a task if pass multiple update properties', async () => {
      const { sut } = makeSut()

      const updatedTask = await sut.superUpdateById(task.id, {
        commentary: 'changed_commentary',
        taskId: 'changed_task_id'
      })

      expect(updatedTask?.commentary).toBe('changed_commentary')
      expect(updatedTask?.taskId).toBe('changed_task_id')
    })

    it('should return null if does not superUpdateById finds a user', async () => {
      const { fakeTask, sut } = makeSut()

      const updatedTask = await sut.superUpdateById(fakeTask.id, { commentary: 'changed_commentary' })

      expect(updatedTask).toBeNull()
    })
  })
})
