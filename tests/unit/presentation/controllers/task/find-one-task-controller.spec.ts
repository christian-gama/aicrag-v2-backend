import { ITask, IUser } from '@/domain'
import { TaskRepositoryProtocol } from '@/domain/repositories/task/task-repository-protocol'
import { ValidatorProtocol } from '@/domain/validators'

import { MustLoginError, TaskNotFoundError } from '@/application/errors'

import { FindOneTaskController } from '@/presentation/controllers/task'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/http/protocols'

import { makeHttpHelper } from '@/factories/helpers'

import {
  makeFakeTask,
  makeFakeUser,
  makeTaskRepositoryStub,
  makeValidatorStub
} from '@/tests/__mocks__'

interface SutTypes {
  fakeTask: ITask
  fakeUser: IUser
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  sut: FindOneTaskController
  taskRepositoryStub: TaskRepositoryProtocol
  validateTaskParamStub: ValidatorProtocol
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const fakeTask = makeFakeTask(fakeUser)
  const httpHelper = makeHttpHelper()
  const request: HttpRequest = { params: { id: 'valid_id' }, user: fakeUser }
  const taskRepositoryStub = makeTaskRepositoryStub(fakeTask)
  const validateTaskParamStub = makeValidatorStub()

  const sut = new FindOneTaskController(validateTaskParamStub, httpHelper, taskRepositoryStub)

  return {
    fakeTask,
    fakeUser,
    httpHelper,
    request,
    sut,
    taskRepositoryStub,
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

    const { httpHelper, request, sut, taskRepositoryStub } = makeSut()
    jest.spyOn(taskRepositoryStub, 'findTaskById').mockReturnValueOnce(Promise.resolve(null))

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

    const { request, sut, taskRepositoryStub } = makeSut()
    const findTaskByIdSpy = jest.spyOn(taskRepositoryStub, 'findTaskById')

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
