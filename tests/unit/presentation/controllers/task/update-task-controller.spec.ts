import { ITask, IUser } from '@/domain'
import { TaskDbRepositoryProtocol } from '@/domain/repositories/task/task-db-repository-protocol'
import { ValidatorProtocol } from '@/domain/validators'

import { InvalidParamError, MustLoginError, TaskNotFoundError } from '@/application/errors'

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
  fakeTask: ITask
  fakeUser: IUser
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  sut: UpdateTaskController
  taskDbRepositoryStub: TaskDbRepositoryProtocol
  validateCommentaryStub: ValidatorProtocol
  validateDateStub: ValidatorProtocol
  validateDurationStub: ValidatorProtocol
  validateTaskParamStub: ValidatorProtocol
  validateTypeStub: ValidatorProtocol
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const fakeTask = makeFakeTask(fakeUser)
  const httpHelper = makeHttpHelper()
  const request: HttpRequest = { body: {}, params: { id: 'valid_id' }, user: fakeUser }
  const taskDbRepositoryStub = makeTaskDbRepositoryStub(fakeTask)
  const validateCommentaryStub = makeValidatorStub()
  const validateDateStub = makeValidatorStub()
  const validateDurationStub = makeValidatorStub()
  const validateTaskParamStub = makeValidatorStub()
  const validateTypeStub = makeValidatorStub()

  const sut = new UpdateTaskController(
    httpHelper,
    taskDbRepositoryStub,
    validateCommentaryStub,
    validateDateStub,
    validateDurationStub,
    validateTaskParamStub,
    validateTypeStub
  )

  return {
    fakeTask,
    fakeUser,
    httpHelper,
    request,
    sut,
    taskDbRepositoryStub,
    validateCommentaryStub,
    validateDateStub,
    validateDurationStub,
    validateTaskParamStub,
    validateTypeStub
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

  it('should return badRequest if there is a commentary and it is invalid', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut, validateCommentaryStub } = makeSut()
    jest
      .spyOn(validateCommentaryStub, 'validate')
      .mockReturnValueOnce(Promise.resolve(new InvalidParamError('commentary')))
    request.body.commentary = 'invalid_commentary'

    const error = await sut.handle(request)

    expect(error).toStrictEqual(httpHelper.badRequest(new InvalidParamError('commentary')))
  })

  it('should return task with new commentary if changes only commentary', async () => {
    expect.hasAssertions()

    const { fakeTask, request, sut } = makeSut()
    fakeTask.commentary = 'new_commentary'
    request.body.commentary = fakeTask.commentary

    const response = await sut.handle(request)

    expect(response.data.task.commentary).toBe('new_commentary')
  })

  it('should return badRequest if there is a date and it is invalid', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut, validateDateStub } = makeSut()
    jest
      .spyOn(validateDateStub, 'validate')
      .mockReturnValueOnce(Promise.resolve(new InvalidParamError('date')))
    request.body.date = 'invalid_date'

    const error = await sut.handle(request)

    expect(error).toStrictEqual(httpHelper.badRequest(new InvalidParamError('date')))
  })

  it('should return task with new date if changes only date', async () => {
    expect.hasAssertions()

    const { fakeTask, request, sut } = makeSut()
    const date = new Date(Date.now())
    fakeTask.date.day = date.getDate()
    fakeTask.date.full = date
    fakeTask.date.hours = date.toLocaleTimeString()
    fakeTask.date.month = date.getMonth()
    fakeTask.date.year = date.getFullYear()
    request.body.date = fakeTask.date.full

    const response = await sut.handle(request)

    expect(response.data.task.date.day).toBe(date.getDate())
    expect(response.data.task.date.full).toBe(date)
    expect(response.data.task.date.hours).toBe(date.toLocaleTimeString())
    expect(response.data.task.date.month).toBe(date.getMonth())
    expect(response.data.task.date.year).toBe(date.getFullYear())
  })

  it('should return badRequest if there is a type and it is invalid', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut, validateTypeStub } = makeSut()
    jest
      .spyOn(validateTypeStub, 'validate')
      .mockReturnValueOnce(Promise.resolve(new InvalidParamError('type')))
    request.body.type = 'invalid_type'

    const error = await sut.handle(request)

    expect(error).toStrictEqual(httpHelper.badRequest(new InvalidParamError('type')))
  })

  it('should return badRequest if there is a duration and it is invalid', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut, validateDurationStub } = makeSut()
    jest
      .spyOn(validateDurationStub, 'validate')
      .mockReturnValueOnce(Promise.resolve(new InvalidParamError('duration')))
    request.body.duration = 'invalid_duration'

    const error = await sut.handle(request)

    expect(error).toStrictEqual(httpHelper.badRequest(new InvalidParamError('duration')))
  })

  it('should return task with new duration if changes only duration', async () => {
    expect.hasAssertions()

    const { fakeTask, request, sut } = makeSut()
    fakeTask.duration = 12.3

    const response = await sut.handle(request)

    expect(response.data.task.duration).toBe(12.3)
  })

  it('should return task with new type and duration if changes only type', async () => {
    expect.hasAssertions()

    const { fakeTask, request, sut } = makeSut()
    fakeTask.duration = 2.4
    fakeTask.type = 'QA'

    const response = await sut.handle(request)

    expect(response.data.task.duration).toBe(2.4)
    expect(response.data.task.type).toBe('QA')
  })
})
