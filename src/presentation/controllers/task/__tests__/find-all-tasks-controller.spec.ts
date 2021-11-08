import { ITask, IUser } from '@/domain'
import { ITaskRepository } from '@/domain/repositories/task'
import { IValidator } from '@/domain/validators'
import { MustLoginError } from '@/application/errors'
import { FindAllTasksController } from '@/presentation/controllers/task'
import { IHttpHelper, HttpRequest } from '@/presentation/http/protocols'
import { makeHttpHelper } from '@/main/factories/helpers'
import { makeFakeTask, makeFakeUser, makeTaskRepositoryStub, makeValidatorStub } from '@/tests/__mocks__'

interface SutTypes {
  fakeTask: ITask
  fakeUser: IUser
  httpHelper: IHttpHelper
  queryValidatorStub: IValidator
  request: HttpRequest
  sut: FindAllTasksController
  taskRepositoryStub: ITaskRepository
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const fakeTask = makeFakeTask(fakeUser)
  const httpHelper = makeHttpHelper()
  const queryValidatorStub = makeValidatorStub()
  const request: HttpRequest = { query: { any_query: 'any_value' }, user: fakeUser }
  const taskRepositoryStub = makeTaskRepositoryStub(fakeTask)

  const sut = new FindAllTasksController(httpHelper, queryValidatorStub, taskRepositoryStub)

  return {
    fakeTask,
    fakeUser,
    httpHelper,
    queryValidatorStub,
    request,
    sut,
    taskRepositoryStub
  }
}

describe('findAllTasksController', () => {
  it('should return unauthorized if there is no user', async () => {
    const { httpHelper, request, sut } = makeSut()
    request.user = undefined

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.unauthorized(new MustLoginError()))
  })

  it('should return badRequest if validation returns an error', async () => {
    const { httpHelper, request, sut, queryValidatorStub } = makeSut()
    jest.spyOn(queryValidatorStub, 'validate').mockReturnValueOnce(Promise.resolve(new Error()))

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.badRequest(new Error()))
  })

  it('should return ok if does not find a task', async () => {
    const { httpHelper, request, sut, taskRepositoryStub } = makeSut()
    jest
      .spyOn(taskRepositoryStub, 'findAll')
      .mockReturnValueOnce(Promise.resolve({ count: 1, displaying: 1, documents: [], page: '1 of 1' }))

    const result = await sut.handle(request)

    expect(result).toStrictEqual(
      httpHelper.ok({
        count: 1,
        displaying: 1,
        documents: [],
        page: '1 of 1'
      })
    )
  })

  it('should call validate with correct data', async () => {
    const { request, sut, queryValidatorStub } = makeSut()
    const validateSpy = jest.spyOn(queryValidatorStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.query)
  })

  it('should call findAll with correct data', async () => {
    const { request, sut, taskRepositoryStub } = makeSut()
    const findTaskByIdSpy = jest.spyOn(taskRepositoryStub, 'findAll')

    await sut.handle(request)

    expect(findTaskByIdSpy).toHaveBeenCalledWith(request.user?.personal.id, request.query)
  })

  it('should return ok with correct task if succeeds', async () => {
    const { fakeTask, httpHelper, request, sut } = makeSut()

    const result = await sut.handle(request)

    expect(result).toStrictEqual(
      httpHelper.ok({
        count: 1,
        displaying: 1,
        documents: [fakeTask],
        page: '1 of 1'
      })
    )
  })
})
