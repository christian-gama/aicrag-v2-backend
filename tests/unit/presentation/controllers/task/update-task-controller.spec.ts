import { IUser } from '@/domain'
import { TaskDbRepositoryProtocol } from '@/domain/repositories/task/task-db-repository-protocol'
import { ValidatorProtocol } from '@/domain/validators'

import { MustLoginError, TaskNotFoundError } from '@/application/errors'

import { UpdateTaskController } from '@/presentation/controllers/task'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/http/protocols'

import { makeHttpHelper } from '@/factories/helpers'

import {
  makeFakeTask,
  makeFakeUser,
  makeTaskDbRepositoryStub,
  makeValidatorStub
} from '@/tests/__mocks__'

interface SutTypes {
  fakeUser: IUser
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  sut: UpdateTaskController
  taskDbRepositoryStub: TaskDbRepositoryProtocol
  validateTaskParamStub: ValidatorProtocol
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const fakeTask = makeFakeTask(fakeUser)
  const httpHelper = makeHttpHelper()
  const request: HttpRequest = { params: { id: 'valid_id' }, user: fakeUser }
  const validateTaskParamStub = makeValidatorStub()
  const taskDbRepositoryStub = makeTaskDbRepositoryStub(fakeTask)

  const sut = new UpdateTaskController(httpHelper, taskDbRepositoryStub, validateTaskParamStub)

  return {
    fakeUser,
    httpHelper,
    request,
    sut,
    taskDbRepositoryStub,
    validateTaskParamStub
  }
}

describe('updateTaskController', () => {
  it('should return unauthorized if there is no user', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut } = makeSut()
    request.user = undefined

    const error = await sut.handle(request)

    expect(error).toStrictEqual(httpHelper.unauthorized(new MustLoginError()))
  })

  it('should return badRequest if param is invalid', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut, validateTaskParamStub } = makeSut()
    jest.spyOn(validateTaskParamStub, 'validate').mockReturnValueOnce(Promise.resolve(new Error()))

    const error = await sut.handle(request)

    expect(error).toStrictEqual(httpHelper.badRequest(new Error()))
  })

  it('should return badRequest if there is no task', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut, taskDbRepositoryStub } = makeSut()
    jest.spyOn(taskDbRepositoryStub, 'findTaskById').mockReturnValueOnce(Promise.resolve(null))

    const error = await sut.handle(request)

    expect(error).toStrictEqual(httpHelper.badRequest(new TaskNotFoundError()))
  })
})
