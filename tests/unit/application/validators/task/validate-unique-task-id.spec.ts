import { ITask, IUser } from '@/domain'
import { TaskDbRepositoryProtocol } from '@/domain/repositories/task/task-db-repository-protocol'

import { ConflictParamError } from '@/application/errors'
import { ValidateUniqueTaskId } from '@/application/validators/task'

import { HttpRequest } from '@/presentation/http/protocols'

import { makeFakeTask, makeFakeUser, makeTaskDbRepositoryStub } from '@/tests/__mocks__'

interface SutTypes {
  fakeTask: ITask
  fakeUser: IUser
  request: HttpRequest
  sut: ValidateUniqueTaskId
  taskDbRepositoryStub: TaskDbRepositoryProtocol
}
const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const fakeTask = makeFakeTask(fakeUser)
  const request: HttpRequest = { body: { taskId: 'any_id', user: fakeUser } }
  const taskDbRepositoryStub = makeTaskDbRepositoryStub(fakeTask)

  const sut = new ValidateUniqueTaskId(taskDbRepositoryStub)

  return { fakeTask, fakeUser, request, sut, taskDbRepositoryStub }
}

describe('validateUniqueTaskId', () => {
  it('should return ConflictParamError if taskId is not unique', async () => {
    expect.hasAssertions()

    const { fakeTask, request, sut } = makeSut()
    request.body.taskId = fakeTask.taskId

    const error = await sut.validate(request.body)

    expect(error).toStrictEqual(new ConflictParamError('taskId'))
  })

  it('should return undefined if taskId is null', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.body.taskId = null

    const response = await sut.validate(request.body)

    expect(response).toBeUndefined()
  })

  it('should return undefined if task does not exist', async () => {
    expect.hasAssertions()

    const { request, sut, taskDbRepositoryStub } = makeSut()
    jest.spyOn(taskDbRepositoryStub, 'findTaskByTaskId').mockReturnValueOnce(Promise.resolve(undefined))

    const response = await sut.validate(request.body)

    expect(response).toBeUndefined()
  })
})
