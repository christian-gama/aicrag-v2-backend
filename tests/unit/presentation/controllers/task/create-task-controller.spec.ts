import { ITask, ITaskData, IUser } from '@/domain'
import { ITaskRepository } from '@/domain/repositories/task'
import { IValidator } from '@/domain/validators'

import { ConflictParamError, MustLoginError } from '@/application/errors'

import { CreateTaskController } from '@/presentation/controllers/task'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/http/protocols'

import { makeHttpHelper } from '@/factories/helpers'

import { makeFakeTask, makeFakeUser, makeTaskRepositoryStub, makeValidatorStub } from '@/tests/__mocks__'

interface SutTypes {
  createTaskValidatorStub: IValidator
  fakeTask: ITask
  fakeTaskData: ITaskData
  fakeUser: IUser
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  sut: CreateTaskController
  taskRepositoryStub: ITaskRepository
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
  const taskRepositoryStub = makeTaskRepositoryStub(fakeTask)

  const sut = new CreateTaskController(createTaskValidatorStub, httpHelper, taskRepositoryStub)

  return {
    createTaskValidatorStub,
    fakeTask,
    fakeTaskData,
    fakeUser,
    httpHelper,
    request,
    sut,
    taskRepositoryStub
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

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.conflict(new ConflictParamError('any_field')))
  })

  it('should return badRequest if validation returns a generic error', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut, createTaskValidatorStub } = makeSut()
    jest.spyOn(createTaskValidatorStub, 'validate').mockReturnValueOnce(Promise.resolve(new Error()))

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.badRequest(new Error()))
  })

  it('should call validate with correct data', async () => {
    expect.hasAssertions()

    const { request, sut, createTaskValidatorStub } = makeSut()
    const data = Object.assign({ user: request.user }, request.body)
    const validateSpy = jest.spyOn(createTaskValidatorStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(data)
  })

  it('should call save with correct data', async () => {
    expect.hasAssertions()

    const { request, sut, taskRepositoryStub } = makeSut()
    const data = Object.assign({ user: request.user }, request.body)
    const saveTaskSpy = jest.spyOn(taskRepositoryStub, 'save')

    await sut.handle(request)

    expect(saveTaskSpy).toHaveBeenCalledWith(data)
  })

  it('should return created with correct task if succeeds', async () => {
    expect.hasAssertions()

    const { fakeTask, httpHelper, request, sut } = makeSut()

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.created({ task: fakeTask }))
  })
})
