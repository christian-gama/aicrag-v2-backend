import { ITask, ITaskData, IUser } from '@/domain'
import { TaskDbRepositoryProtocol } from '@/domain/repositories/task/task-db-repository-protocol'
import { ValidatorProtocol } from '@/domain/validators'

import { ConflictParamError, MustLoginError } from '@/application/errors'

import { CreateTaskController } from '@/presentation/controllers/task'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/http/protocols'

import { makeHttpHelper } from '@/factories/helpers'

import {
  makeFakeTask,
  makeFakeUser,
  makeTaskDbRepositoryStub,
  makeValidatorStub
} from '@/tests/__mocks__'

interface SutTypes {
  createTaskValidatorStub: ValidatorProtocol
  fakeTask: ITask
  fakeTaskData: ITaskData
  fakeUser: IUser
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  sut: CreateTaskController
  taskDbRepositoryStub: TaskDbRepositoryProtocol
}

const makeSut = (): SutTypes => {
  const createTaskValidatorStub = makeValidatorStub()
  const fakeUser = makeFakeUser()
  const fakeTask = makeFakeTask(fakeUser)
  const fakeTaskData: ITaskData = {
    commentary: fakeTask.commentary,
    date: fakeTask.date.full.toString(),
    duration: fakeTask.duration,
    status: fakeTask.status,
    taskId: fakeTask.taskId,
    type: fakeTask.type,
    user: fakeUser
  }

  const httpHelper = makeHttpHelper()
  const request: HttpRequest = { body: fakeTaskData, user: fakeUser }
  const taskDbRepositoryStub = makeTaskDbRepositoryStub(fakeTask)

  const sut = new CreateTaskController(createTaskValidatorStub, httpHelper, taskDbRepositoryStub)

  return {
    createTaskValidatorStub,
    fakeTask,
    fakeTaskData,
    fakeUser,
    httpHelper,
    request,
    sut,
    taskDbRepositoryStub
  }
}

describe('createTaskController', () => {
  it('should return unauthorized if there is no user', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut } = makeSut()
    request.user = undefined

    const error = await sut.handle(request)

    expect(error).toStrictEqual(httpHelper.unauthorized(new MustLoginError()))
  })

  it('should return conflict if validation fails and is a ConflictParamError', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut, createTaskValidatorStub } = makeSut()
    jest
      .spyOn(createTaskValidatorStub, 'validate')
      .mockReturnValueOnce(Promise.resolve(new ConflictParamError('any_field')))

    const error = await sut.handle(request)

    expect(error).toStrictEqual(httpHelper.conflict(new ConflictParamError('any_field')))
  })

  it('should return badRequest if validation returns a generic error', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut, createTaskValidatorStub } = makeSut()
    jest
      .spyOn(createTaskValidatorStub, 'validate')
      .mockReturnValueOnce(Promise.resolve(new Error()))

    const error = await sut.handle(request)

    expect(error).toStrictEqual(httpHelper.badRequest(new Error()))
  })

  it('should call validate with correct data', async () => {
    expect.hasAssertions()

    const { request, sut, createTaskValidatorStub } = makeSut()
    const data = Object.assign({ user: request.user }, request.body)
    const validateSpy = jest.spyOn(createTaskValidatorStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(data)
  })

  it('should call saveTask with correct data', async () => {
    expect.hasAssertions()

    const { request, sut, taskDbRepositoryStub } = makeSut()
    const data = Object.assign({ user: request.user }, request.body)
    const saveTaskSpy = jest.spyOn(taskDbRepositoryStub, 'saveTask')

    await sut.handle(request)

    expect(saveTaskSpy).toHaveBeenCalledWith(data)
  })

  it('should return created with correct task if succeeds', async () => {
    expect.hasAssertions()

    const { fakeTask, httpHelper, request, sut } = makeSut()

    const response = await sut.handle(request)

    expect(response).toStrictEqual(httpHelper.created({ task: fakeTask }))
  })
})
