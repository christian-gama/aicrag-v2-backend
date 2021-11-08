import { ITask, IUser } from '@/domain'
import { ITaskRepository } from '@/domain/repositories/task'
import { IValidator } from '@/domain/validators'
import { InvalidParamError, MustLoginError, TaskNotFoundError } from '@/application/errors'
import { UpdateTaskController } from '@/presentation/controllers/task'
import { IHttpHelper, HttpRequest } from '@/presentation/http/protocols'
import { makeHttpHelper } from '@/main/factories/helpers'
import { makeFakeTask, makeFakeUser, makeTaskRepositoryStub, makeValidatorStub } from '@/tests/__mocks__'
import MockDate from 'mockdate'

interface SutTypes {
  fakeTask: ITask
  fakeUser: IUser
  httpHelper: IHttpHelper
  request: HttpRequest
  sut: UpdateTaskController
  taskRepositoryStub: ITaskRepository
  validateCommentaryStub: IValidator
  validateDateStub: IValidator
  validateDurationStub: IValidator
  validateStatusStub: IValidator
  validateTaskIdStub: IValidator
  validateTaskParamStub: IValidator
  validateTypeStub: IValidator
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const fakeTask = makeFakeTask(fakeUser)
  const httpHelper = makeHttpHelper()
  const request: HttpRequest = { body: {}, params: { id: 'valid_id' }, user: fakeUser }
  const taskRepositoryStub = makeTaskRepositoryStub(fakeTask)
  const validateCommentaryStub = makeValidatorStub()
  const validateDateStub = makeValidatorStub()
  const validateDurationStub = makeValidatorStub()
  const validateStatusStub = makeValidatorStub()
  const validateTaskIdStub = makeValidatorStub()
  const validateTaskParamStub = makeValidatorStub()
  const validateTypeStub = makeValidatorStub()

  const sut = new UpdateTaskController(
    httpHelper,
    taskRepositoryStub,
    validateCommentaryStub,
    validateDateStub,
    validateDurationStub,
    validateStatusStub,
    validateTaskIdStub,
    validateTaskParamStub,
    validateTypeStub
  )

  return {
    fakeTask,
    fakeUser,
    httpHelper,
    request,
    sut,
    taskRepositoryStub,
    validateCommentaryStub,
    validateDateStub,
    validateDurationStub,
    validateStatusStub,
    validateTaskIdStub,
    validateTaskParamStub,
    validateTypeStub
  }
}

describe('updateTaskController', () => {
  afterAll(() => {
    MockDate.reset()
  })

  beforeAll(() => {
    MockDate.set(new Date())
  })

  it('should return unauthorized if there is no user', async () => {
    const { httpHelper, request, sut } = makeSut()
    request.user = undefined

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.unauthorized(new MustLoginError()))
  })

  it('should return badRequest if param is invalid', async () => {
    const { httpHelper, request, sut, validateTaskParamStub } = makeSut()
    jest.spyOn(validateTaskParamStub, 'validate').mockReturnValueOnce(Promise.resolve(new Error()))

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.badRequest(new Error()))
  })

  it('should return badRequest if there is no task', async () => {
    const { httpHelper, request, sut, taskRepositoryStub } = makeSut()
    jest.spyOn(taskRepositoryStub, 'findById').mockReturnValueOnce(Promise.resolve(null))

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.badRequest(new TaskNotFoundError()))
  })

  it('should return badRequest if there is a commentary and it is invalid', async () => {
    const { httpHelper, request, sut, validateCommentaryStub } = makeSut()
    jest
      .spyOn(validateCommentaryStub, 'validate')
      .mockReturnValueOnce(Promise.resolve(new InvalidParamError('commentary')))
    request.body.commentary = 'invalid_commentary'

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.badRequest(new InvalidParamError('commentary')))
  })

  it('should return task with new commentary if changes only commentary', async () => {
    const { fakeUser, request, sut, taskRepositoryStub } = makeSut()
    const updatedTask = makeFakeTask(fakeUser)
    request.body.commentary = 'new_commentary'
    updatedTask.commentary = request.body.commentary
    jest.spyOn(taskRepositoryStub, 'updateById').mockReturnValueOnce(Promise.resolve(updatedTask))

    const result = await sut.handle(request)

    expect(result.data.task.commentary).toBe('new_commentary')
  })

  it('should call updateById with correct values if changes commentary', async () => {
    const { fakeTask, fakeUser, request, sut, taskRepositoryStub } = makeSut()
    const updateTaskSpy = jest.spyOn(taskRepositoryStub, 'updateById')
    request.body.commentary = 'any_commentary'

    await sut.handle(request)

    expect(updateTaskSpy).toHaveBeenCalledWith(fakeTask.id, fakeUser.personal.id, {
      commentary: 'any_commentary',
      'logs.updatedAt': new Date()
    })
  })

  it('should return badRequest if there is a date and it is invalid', async () => {
    const { httpHelper, request, sut, validateDateStub } = makeSut()
    jest.spyOn(validateDateStub, 'validate').mockReturnValueOnce(Promise.resolve(new InvalidParamError('date')))
    request.body.date = 'invalid_date'

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.badRequest(new InvalidParamError('date')))
  })

  it('should return task with new date if changes only date', async () => {
    const { fakeTask, request, sut } = makeSut()
    const date = new Date()
    fakeTask.date.day = date.getUTCDate()
    fakeTask.date.full = date
    fakeTask.date.hours = date.toLocaleTimeString('pt-br', { timeZone: 'UTC' })
    fakeTask.date.month = date.getUTCMonth()
    fakeTask.date.year = date.getUTCFullYear()
    request.body.date = fakeTask.date.full

    const result = (await sut.handle(request)).data.task.date

    expect(result.day).toBe(date.getUTCDate())
    expect(result.full).toBe(date)
    expect(result.hours).toBe(date.toLocaleTimeString('pt-br', { timeZone: 'UTC' }))
    expect(result.month).toBe(date.getUTCMonth())
    expect(result.year).toBe(date.getUTCFullYear())
  })

  it('should call updateById with correct values if changes date', async () => {
    const { fakeTask, fakeUser, request, sut, taskRepositoryStub } = makeSut()
    const updateTaskSpy = jest.spyOn(taskRepositoryStub, 'updateById')
    const date = new Date()

    request.body.date = date

    await sut.handle(request)

    // Must parse date because of innacuracy, which makes the test fail
    const parsedDate = new Date(Date.parse(date.toString()))

    expect(updateTaskSpy).toHaveBeenCalledWith(fakeTask.id, fakeUser.personal.id, {
      'date.day': parsedDate.getUTCDate(),
      'date.full': parsedDate,
      'date.hours': parsedDate.toLocaleTimeString('pt-br', { timeZone: 'UTC' }),
      'date.month': parsedDate.getUTCMonth(),
      'date.year': parsedDate.getUTCFullYear(),
      'logs.updatedAt': date
    })
  })

  it('should return badRequest if there is a type and it is invalid', async () => {
    const { httpHelper, request, sut, validateTypeStub } = makeSut()
    jest.spyOn(validateTypeStub, 'validate').mockReturnValueOnce(Promise.resolve(new InvalidParamError('type')))
    request.body.type = 'invalid_type'

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.badRequest(new InvalidParamError('type')))
  })

  it('should return badRequest if there is a duration and it is invalid', async () => {
    const { httpHelper, request, sut, validateDurationStub } = makeSut()
    jest.spyOn(validateDurationStub, 'validate').mockReturnValueOnce(Promise.resolve(new InvalidParamError('duration')))
    request.body.duration = 'invalid_duration'

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.badRequest(new InvalidParamError('duration')))
  })

  it('should return task with new duration if changes only duration', async () => {
    const { fakeUser, request, sut, taskRepositoryStub } = makeSut()
    const updatedTask = makeFakeTask(fakeUser)
    request.body.duration = 12.3
    updatedTask.duration = request.body.duration
    jest.spyOn(taskRepositoryStub, 'updateById').mockReturnValueOnce(Promise.resolve(updatedTask))

    const result = (await sut.handle(request)).data.task

    expect(result.duration).toBe(12.3)
  })

  it('should return task with new type and duration if changes only type', async () => {
    const { fakeUser, request, sut, taskRepositoryStub } = makeSut()
    const updatedTask = makeFakeTask(fakeUser)
    request.body.duration = 12.3
    request.body.type = 'QA'
    updatedTask.duration = request.body.duration
    updatedTask.type = request.body.type
    jest.spyOn(taskRepositoryStub, 'updateById').mockReturnValueOnce(Promise.resolve(updatedTask))

    const result = (await sut.handle(request)).data.task

    expect(result.duration).toBe(request.body.duration)
    expect(result.type).toBe(request.body.type)
  })

  it('should call updateById with correct values if changes duration', async () => {
    const { fakeTask, fakeUser, request, sut, taskRepositoryStub } = makeSut()
    const updateTaskSpy = jest.spyOn(taskRepositoryStub, 'updateById')
    request.body.duration = 15

    await sut.handle(request)

    expect(updateTaskSpy).toHaveBeenCalledWith(fakeTask.id, fakeUser.personal.id, {
      duration: 15,
      'logs.updatedAt': new Date(Date.now()),
      type: 'TX',
      usd: 16.25
    })
  })

  it('should return a default message if there is no changes', async () => {
    const { httpHelper, request, sut } = makeSut()

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.ok({ message: 'No changes were made' }))
  })

  it('should return a default message if there tries to update to the same value', async () => {
    const { fakeTask, httpHelper, request, sut } = makeSut()

    request.body.duration = fakeTask.duration
    request.body.type = fakeTask.type
    request.body.taskId = fakeTask.taskId
    request.body.commentary = fakeTask.commentary
    request.body.date = fakeTask.date.full.toISOString()

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.ok({ message: 'No changes were made' }))
  })

  it('should return update the updatedAt property if there is a change', async () => {
    const { fakeUser, request, sut, taskRepositoryStub } = makeSut()
    const date = new Date(Date.now())
    const updatedTask = makeFakeTask(fakeUser)
    request.body.commentary = 'any_commentary'
    updatedTask.logs.updatedAt = date
    updatedTask.commentary = request.body.commentary
    jest.spyOn(taskRepositoryStub, 'updateById').mockReturnValueOnce(Promise.resolve(updatedTask))

    const result = (await sut.handle(request)).data.task.logs

    expect(result.updatedAt).toBe(date)
  })

  it('should return badRequest if there is a status and it is invalid', async () => {
    const { httpHelper, request, sut, validateStatusStub } = makeSut()
    jest.spyOn(validateStatusStub, 'validate').mockReturnValueOnce(Promise.resolve(new InvalidParamError('status')))
    request.body.status = 'invalid_status'

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.badRequest(new InvalidParamError('status')))
  })

  it('should return a task with new status if changes only status', async () => {
    const { fakeUser, request, sut, taskRepositoryStub } = makeSut()
    const updatedTask = makeFakeTask(fakeUser)
    request.body.status = 'in_progress'
    updatedTask.status = request.body.status
    jest.spyOn(taskRepositoryStub, 'updateById').mockReturnValueOnce(Promise.resolve(updatedTask))

    const result = (await sut.handle(request)).data.task

    expect(result.status).toBe(request.body.status)
  })

  it('should call updateById with correct values if changes status', async () => {
    const { fakeTask, fakeUser, request, sut, taskRepositoryStub } = makeSut()
    const updateTaskSpy = jest.spyOn(taskRepositoryStub, 'updateById')
    request.body.status = 'in_progress'

    await sut.handle(request)

    expect(updateTaskSpy).toHaveBeenCalledWith(fakeTask.id, fakeUser.personal.id, {
      'logs.updatedAt': new Date(Date.now()),
      status: 'in_progress'
    })
  })

  it('should return badRequest if there is a taskId and it is invalid', async () => {
    const { httpHelper, request, sut, validateTaskIdStub } = makeSut()
    jest.spyOn(validateTaskIdStub, 'validate').mockReturnValueOnce(Promise.resolve(new InvalidParamError('taskId')))
    request.body.taskId = 'invalid_taskId'

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.badRequest(new InvalidParamError('taskId')))
  })

  it('should return badRequest if is unable to update the task', async () => {
    const { httpHelper, request, sut, taskRepositoryStub } = makeSut()
    jest.spyOn(taskRepositoryStub, 'updateById').mockReturnValueOnce(Promise.resolve(null))
    request.body.taskId = 'any_value'

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.badRequest(new TaskNotFoundError()))
  })

  it('should call updateById with correct values if changes taskId', async () => {
    const { fakeTask, fakeUser, request, sut, taskRepositoryStub } = makeSut()
    const updateTaskSpy = jest.spyOn(taskRepositoryStub, 'updateById')
    request.body.taskId = 'any_value'

    await sut.handle(request)

    expect(updateTaskSpy).toHaveBeenCalledWith(fakeTask.id, fakeUser.personal.id, {
      'logs.updatedAt': new Date(Date.now()),
      taskId: 'any_value'
    })
  })
})
