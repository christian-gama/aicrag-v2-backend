import { ITask, IUser } from '@/domain'
import { TaskDbRepositoryProtocol } from '@/domain/repositories/task/task-db-repository-protocol'
import { ValidatorProtocol } from '@/domain/validators'

import { MustLoginError, TaskNotFoundError } from '@/application/errors'

import { FindOneTaskController } from '@/presentation/controllers/task'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/http/protocols'

import { makeHttpHelper } from '@/factories/helpers'

import {
  makeFakeTask,
  makeFakeUser,
  makeTaskDbRepositoryStub,
  makeValidatorStub
} from '@/tests/__mocks__'

interface SutTypes {
  fakeTask: ITask
  fakeUser: IUser
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  sut: FindOneTaskController
  taskDbRepositoryStub: TaskDbRepositoryProtocol
  validateTaskParamStub: ValidatorProtocol
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const fakeTask = makeFakeTask(fakeUser)
  const httpHelper = makeHttpHelper()
  const request: HttpRequest = { params: { id: 'valid_id' }, user: fakeUser }
  const taskDbRepositoryStub = makeTaskDbRepositoryStub(fakeTask)
  const validateTaskParamStub = makeValidatorStub()

  const sut = new FindOneTaskController(validateTaskParamStub, httpHelper, taskDbRepositoryStub)

  return {
    fakeTask,
    fakeUser,
    httpHelper,
    request,
    sut,
    taskDbRepositoryStub,
    validateTaskParamStub
  }
}

describe('findOneTaskController', () => {
  it('should return unauthorized if there is no user', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut } = makeSut()
    request.user = undefined

    const error = await sut.handle(request)

    expect(error).toStrictEqual(httpHelper.unauthorized(new MustLoginError()))
  })

  it('should return badRequest if validation returns an error', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut, validateTaskParamStub } = makeSut()
    jest.spyOn(validateTaskParamStub, 'validate').mockReturnValueOnce(Promise.resolve(new Error()))

    const error = await sut.handle(request)

    expect(error).toStrictEqual(httpHelper.badRequest(new Error()))
  })

  it('should return badRequest if does not find a task', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut, taskDbRepositoryStub } = makeSut()
    jest.spyOn(taskDbRepositoryStub, 'findTaskById').mockReturnValueOnce(Promise.resolve(undefined))

    const error = await sut.handle(request)

    expect(error).toStrictEqual(httpHelper.badRequest(new TaskNotFoundError()))
  })

  it('should call validate with correct data', async () => {
    expect.hasAssertions()

    const { request, sut, validateTaskParamStub } = makeSut()
    const validateSpy = jest.spyOn(validateTaskParamStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.params)
  })

  it('should call findTaskById with correct data', async () => {
    expect.hasAssertions()

    const { request, sut, taskDbRepositoryStub } = makeSut()
    const findTaskByIdSpy = jest.spyOn(taskDbRepositoryStub, 'findTaskById')

    await sut.handle(request)

    expect(findTaskByIdSpy).toHaveBeenCalledWith(request.params.id, request.user?.personal.id)
  })

  it('should return ok with correct task if succeeds', async () => {
    expect.hasAssertions()

    const { fakeTask, httpHelper, request, sut } = makeSut()

    const response = await sut.handle(request)

    expect(response).toStrictEqual(httpHelper.ok({ task: fakeTask }))
  })
})
