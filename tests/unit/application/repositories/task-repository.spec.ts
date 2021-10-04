import { ITaskData } from '@/domain'
import { UuidProtocol } from '@/domain/helpers'

import { TaskRepository } from '@/application/repositories'

import { makeUuidStub } from '@/tests/__mocks__'
import { makeFakeTaskData } from '@/tests/__mocks__/mock-task'

import MockDate from 'mockdate'

interface SutTypes {
  fakeTaskData: ITaskData
  sut: TaskRepository
  uuidStub: UuidProtocol
}

const makeSut = (): SutTypes => {
  const fakeTaskData = makeFakeTaskData()
  const uuidStub = makeUuidStub()

  const sut = new TaskRepository(uuidStub)

  return { fakeTaskData, sut, uuidStub }
}

describe('taskRepository', () => {
  afterAll(() => {
    MockDate.reset()
  })

  beforeAll(() => {
    MockDate.set(new Date())
  })

  it('should return a task with correct values', async () => {
    expect.hasAssertions()

    const { fakeTaskData, sut, uuidStub } = makeSut()
    const { commentary, date, duration, taskId, status, type, user } = fakeTaskData
    const fakeId = uuidStub.generate()

    const task = sut.createTask(fakeTaskData)

    expect(task).toStrictEqual({
      commentary,
      date: {
        day: date.getDate(),
        full: date,
        hours: date.toLocaleTimeString(),
        month: date.getMonth(),
        year: date.getFullYear()
      },
      duration,
      id: fakeId,
      logs: {
        createdAt: new Date(Date.now()),
        updatedAt: null
      },
      status,
      taskId,
      type,
      user
    })
  })

  it('should return a task with correct values if commentary and taskId are null', async () => {
    expect.hasAssertions()

    const { fakeTaskData, sut, uuidStub } = makeSut()
    const { date, duration, status, type, user } = fakeTaskData
    const fakeId = uuidStub.generate()
    fakeTaskData.commentary = null
    fakeTaskData.taskId = null

    const task = sut.createTask(fakeTaskData)

    expect(task).toStrictEqual({
      commentary: null,
      date: {
        day: date.getDate(),
        full: date,
        hours: date.toLocaleTimeString(),
        month: date.getMonth(),
        year: date.getFullYear()
      },
      duration,
      id: fakeId,
      logs: {
        createdAt: new Date(Date.now()),
        updatedAt: null
      },
      status,
      taskId: null,
      type,
      user
    })
  })
})
