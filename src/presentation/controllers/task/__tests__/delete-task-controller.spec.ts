import { ITask, IUser } from '@/domain'
import { ITaskRepository } from '@/domain/repositories/task'
import { IValidator } from '@/domain/validators'
import { MustLoginError, TaskNotFoundError } from '@/application/errors'
import { DeleteTaskController } from '@/presentation/controllers/task'
import { IHttpHelper, HttpRequest } from '@/presentation/http/protocols'
import { makeHttpHelper } from '@/main/factories/helpers'
import { makeFakeTask, makeFakeUser, makeTaskRepositoryStub, makeValidatorStub } from '@/tests/__mocks__'

interface SutTypes {
  fakeTask: ITask
  fakeUser: IUser
  httpHelper: IHttpHelper
  request: HttpRequest
  sut: DeleteTaskController
  taskRepositoryStub: ITaskRepository
  validateTaskParamStub: IValidator
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const fakeTask = makeFakeTask(fakeUser)
  const httpHelper = makeHttpHelper()
  const request: HttpRequest = { params: { id: 'valid_id' }, user: fakeUser }
  const taskRepositoryStub = makeTaskRepositoryStub(fakeTask)
  const validateTaskParamStub = makeValidatorStub()

  const sut = new DeleteTaskController(validateTaskParamStub, httpHelper, taskRepositoryStub)

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

describe('deleteTaskController', () => {
  it('should return unauthorized if there is no user', async () => {
    const { httpHelper, request, sut } = makeSut()
    request.user = undefined

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.unauthorized(new MustLoginError()))
  })

  it('should return badRequest if validation returns an error', async () => {
    const { httpHelper, request, sut, validateTaskParamStub } = makeSut()
    jest.spyOn(validateTaskParamStub, 'validate').mockReturnValueOnce(Promise.resolve(new Error()))

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.badRequest(new Error()))
  })

  it('should return badRequest if does not delete a task', async () => {
    const { httpHelper, request, sut, taskRepositoryStub } = makeSut()
    jest.spyOn(taskRepositoryStub, 'deleteById').mockReturnValueOnce(Promise.resolve(false))

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.badRequest(new TaskNotFoundError()))
  })

  it('should call validate with correct data', async () => {
    const { request, sut, validateTaskParamStub } = makeSut()
    const validateSpy = jest.spyOn(validateTaskParamStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.params)
  })

  it('should call delete with correct data', async () => {
    const { request, sut, taskRepositoryStub } = makeSut()
    const deleteTaskSpy = jest.spyOn(taskRepositoryStub, 'deleteById')

    await sut.handle(request)

    expect(deleteTaskSpy).toHaveBeenCalledWith(request.params.id, request.user?.personal.id)
  })

  it('should return deleted if succeeds', async () => {
    const { httpHelper, request, sut } = makeSut()

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.deleted())
  })
})
