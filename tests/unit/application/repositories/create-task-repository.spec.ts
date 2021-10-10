import { ITaskData, IUser } from '@/domain'
import { UuidProtocol } from '@/domain/helpers'

import { CreateTaskRepository } from '@/application/repositories'

import { makeFakeUser, makeUuidStub } from '@/tests/__mocks__'
import { makeFakeTaskData } from '@/tests/__mocks__/mock-task'

import MockDate from 'mockdate'

interface SutTypes {
  fakeTaskData: ITaskData
  fakeUser: IUser
  sut: CreateTaskRepository
  uuidStub: UuidProtocol
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const fakeTaskData = makeFakeTaskData(fakeUser)
  const uuidStub = makeUuidStub()

  const sut = new CreateTaskRepository(uuidStub)

  return { fakeTaskData, fakeUser, sut, uuidStub }
}

describe('createTaskRepository', () => {
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
    const d = new Date(Date.parse(date))
    const fakeId = uuidStub.generate()
    const usd =
      type === 'TX'
        ? (duration / 60) * 65 * user.settings.handicap
        : (duration / 60) * 112.5 * user.settings.handicap
    const task = sut.createTask(fakeTaskData)

    expect(task).toStrictEqual({
      commentary,
      date: {
        day: d.getDate(),
        full: d,
        hours: d.toLocaleTimeString(),
        month: d.getMonth(),
        year: d.getFullYear()
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
      userId: user.personal.id
    })
  })

  it('should return a task with correct values if commentary and taskId are falsy', async () => {
    expect.hasAssertions()

    const { fakeTaskData, sut, uuidStub } = makeSut()
    const { date, duration, status, type, user } = fakeTaskData
    const d = new Date(Date.parse(date))
    const fakeId = uuidStub.generate()
    const usd =
      type === 'TX'
        ? (duration / 60) * 65 * user.settings.handicap
        : (duration / 60) * 112.5 * user.settings.handicap
    fakeTaskData.commentary = null
    fakeTaskData.taskId = null

    const task = sut.createTask(fakeTaskData)

    expect(task).toStrictEqual({
      commentary: '',
      date: {
        day: d.getDate(),
        full: d,
        hours: d.toLocaleTimeString(),
        month: d.getMonth(),
        year: d.getFullYear()
      },
      duration,
      id: fakeId,
      logs: {
        createdAt: new Date(Date.now()),
        updatedAt: null
      },
      status,
      taskId: '',
      type,
      usd,
      userId: user.personal.id
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
