import { ITask, IUser } from '@/domain'
import { TaskDbRepositoryProtocol } from '@/domain/repositories/task/task-db-repository-protocol'
import { ValidatorProtocol } from '@/domain/validators'

import { MustLoginError } from '@/application/errors'

import { FindAllTasksController } from '@/presentation/controllers/task'
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
  queryValidatorStub: ValidatorProtocol
  request: HttpRequest
  sut: FindAllTasksController
  taskDbRepositoryStub: TaskDbRepositoryProtocol
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const fakeTask = makeFakeTask(fakeUser)
  const httpHelper = makeHttpHelper()
  const queryValidatorStub = makeValidatorStub()
  const request: HttpRequest = { query: { any_query: 'any_value' }, user: fakeUser }
  const taskDbRepositoryStub = makeTaskDbRepositoryStub(fakeTask)

  const sut = new FindAllTasksController(httpHelper, queryValidatorStub, taskDbRepositoryStub)

  return {
    fakeTask,
    fakeUser,
    httpHelper,
    queryValidatorStub,
    request,
    sut,
    taskDbRepositoryStub
  }
}

describe('findAllTasksController', () => {
  it('should return unauthorized if there is no user', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut } = makeSut()
    request.user = undefined

    const error = await sut.handle(request)

    expect(error).toStrictEqual(httpHelper.unauthorized(new MustLoginError()))
  })

  it('should return badRequest if validation returns an error', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut, queryValidatorStub } = makeSut()
    jest.spyOn(queryValidatorStub, 'validate').mockReturnValueOnce(Promise.resolve(new Error()))

    const error = await sut.handle(request)

    expect(error).toStrictEqual(httpHelper.badRequest(new Error()))
  })

  it('should return ok if does not find a task', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut, taskDbRepositoryStub } = makeSut()
    jest
      .spyOn(taskDbRepositoryStub, 'findAllTasks')
      .mockReturnValueOnce(
        Promise.resolve({ count: 0, currentPage: 1, documents: [], totalPages: 1 })
      )

    const response = await sut.handle(request)

    expect(response).toStrictEqual(
      httpHelper.ok({
        documents: [],
        page: '1 of 1'
      })
    )
  })

  it('should call validate with correct data', async () => {
    expect.hasAssertions()

    const { request, sut, queryValidatorStub } = makeSut()
    const validateSpy = jest.spyOn(queryValidatorStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.query)
  })

  it('should call findAllTasks with correct data', async () => {
    expect.hasAssertions()

    const { request, sut, taskDbRepositoryStub } = makeSut()
    const findTaskByIdSpy = jest.spyOn(taskDbRepositoryStub, 'findAllTasks')

    await sut.handle(request)

    expect(findTaskByIdSpy).toHaveBeenCalledWith(request.user?.personal.id, request.query)
  })

  it('should return ok with correct task if succeeds', async () => {
    expect.hasAssertions()

    const { fakeTask, httpHelper, request, sut } = makeSut()

    const response = await sut.handle(request)

    expect(response).toStrictEqual(
      httpHelper.ok({
        documents: [fakeTask],
        page: '1 of 1'
      })
    )
  })
})
