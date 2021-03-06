import { ITask, IUser } from '@/domain'
import { ITaskRepository } from '@/domain/repositories/task'
import { ConflictParamError, InvalidTypeError } from '@/application/errors'
import { ValidateUniqueTaskId } from '@/application/validators/task'
import { HttpRequest } from '@/presentation/http/protocols'
import { makeFakeTask, makeFakeUser, makeTaskRepositoryStub } from '@/tests/__mocks__'

interface SutTypes {
  fakeTask: ITask
  fakeUser: IUser
  request: HttpRequest
  sut: ValidateUniqueTaskId
  taskRepositoryStub: ITaskRepository
}
const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const fakeTask = makeFakeTask(fakeUser)
  const request: HttpRequest = { body: { taskId: 'any_id', user: fakeUser } }
  const taskRepositoryStub = makeTaskRepositoryStub(fakeTask)

  const sut = new ValidateUniqueTaskId(taskRepositoryStub)

  return { fakeTask, fakeUser, request, sut, taskRepositoryStub }
}

describe('validateUniqueTaskId', () => {
  it('should return InvalidTypeError if taskId has an invalid taskId', async () => {
    const { sut } = makeSut()
    const data = { taskId: 123 }

    const result = await sut.validate(data)

    expect(result).toStrictEqual(new InvalidTypeError('taskId', 'string', typeof data.taskId))
  })

  it('should return ConflictParamError if taskId is not unique', async () => {
    const { fakeTask, request, sut } = makeSut()
    request.body.taskId = fakeTask.taskId

    const result = await sut.validate(request.body)

    expect(result).toStrictEqual(new ConflictParamError('taskId'))
  })

  it('should return undefined if taskId is null', async () => {
    const { request, sut } = makeSut()
    request.body.taskId = null

    const result = await sut.validate(request.body)

    expect(result).toBeUndefined()
  })

  it('should return undefined if task does not exist', async () => {
    const { request, sut, taskRepositoryStub } = makeSut()
    jest.spyOn(taskRepositoryStub, 'findByTaskId').mockReturnValueOnce(Promise.resolve(null))

    const result = await sut.validate(request.body)

    expect(result).toBeUndefined()
  })
})
