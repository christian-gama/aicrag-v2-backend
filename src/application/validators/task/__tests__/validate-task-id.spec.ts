import { ITask, IUser } from '@/domain'
import { ITaskRepository } from '@/domain/repositories'
import { ConflictParamError, InvalidParamError, InvalidTypeError } from '@/application/errors'
import { ValidateTaskId } from '@/application/validators/task'
import { HttpRequest } from '@/presentation/http/protocols'
import { makeFakeTask, makeFakeUser, makeTaskRepositoryStub } from '@/tests/__mocks__'
import faker from 'faker'

interface SutTypes {
  fakeTask: ITask
  fakeUser: IUser
  request: HttpRequest
  sut: ValidateTaskId
  taskRepositoryStub: ITaskRepository
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const fakeTask = makeFakeTask(fakeUser)
  const request: HttpRequest = {
    body: { taskId: faker.random.alphaNumeric(100) }
  }
  const taskRepositoryStub = makeTaskRepositoryStub(fakeTask)

  const sut = new ValidateTaskId(taskRepositoryStub)

  return { fakeTask, fakeUser, request, sut, taskRepositoryStub }
}

describe('validateTaskId', () => {
  it('should return InvalidTypeError if taskId is not a string', async () => {
    const { request, sut } = makeSut()
    request.body.taskId = 123

    const result = await sut.validate(request.body)

    expect(result).toStrictEqual(new InvalidTypeError('taskId'))
  })

  it('should return InvalidParamError if taskId length is greater than 120', async () => {
    const { request, sut } = makeSut()
    request.body.taskId = faker.random.alphaNumeric(121)

    const result = await sut.validate(request.body)

    expect(result).toStrictEqual(new InvalidParamError('taskId'))
  })

  it('should return ConflictParamError if taskId already exists from a different task', async () => {
    const { fakeTask, fakeUser, request, sut, taskRepositoryStub } = makeSut()
    jest.spyOn(taskRepositoryStub, 'findByTaskId').mockReturnValueOnce(Promise.resolve(makeFakeTask(makeFakeUser())))

    request.body.user = fakeUser
    request.body.task = fakeTask
    request.body.taskId = faker.random.alphaNumeric(120)

    const result = await sut.validate(request.body)

    expect(result).toStrictEqual(new ConflictParamError('taskId'))
  })

  it('should return undefined if taskId already exists but from same task', async () => {
    const { fakeTask, fakeUser, request, sut, taskRepositoryStub } = makeSut()
    jest.spyOn(taskRepositoryStub, 'findByTaskId').mockReturnValueOnce(Promise.resolve(fakeTask))

    request.body.user = fakeUser
    request.body.task = fakeTask
    request.body.taskId = faker.random.alphaNumeric(120)

    const result = await sut.validate(request.body)

    expect(result).toBeUndefined()
  })

  it('should return undefined if succeeds', async () => {
    const { request, sut } = makeSut()

    const result = await sut.validate(request.body)

    expect(result).toBeUndefined()
  })

  it('should return undefined if taskId is null', async () => {
    const { request, sut } = makeSut()
    request.body.taskId = null

    const result = await sut.validate(request.body)

    expect(result).toBeUndefined()
  })
})
