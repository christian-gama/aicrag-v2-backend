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
    const usd =
      type === 'TX'
        ? (duration / 60) * 65 * user.settings.handicap
        : (duration / 60) * 112.5 * user.settings.handicap

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
      usd,
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
    const usd =
      type === 'TX'
        ? (duration / 60) * 65 * user.settings.handicap
        : (duration / 60) * 112.5 * user.settings.handicap

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
      usd,
      user
    })
  })

  it('should return correct usd value if type is TX', async () => {
    expect.hasAssertions()

    const { fakeTaskData, sut } = makeSut()
    fakeTaskData.type = 'TX'

    const task = sut.createTask(fakeTaskData)

    expect(task.usd).toBe(32.5)
  })

  it('should return correct usd value if type is QA', async () => {
    expect.hasAssertions()

    const { fakeTaskData, sut } = makeSut()
    fakeTaskData.duration = 2.4
    fakeTaskData.type = 'QA'

    const task = sut.createTask(fakeTaskData)

    expect(task.usd).toBe(4.5)
  })
})
