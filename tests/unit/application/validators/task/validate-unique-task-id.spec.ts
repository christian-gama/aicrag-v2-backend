import { ITask, IUser } from '@/domain'
import { ITaskRepository } from '@/domain/repositories/task'

import { ConflictParamError } from '@/application/errors'
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

    const { request, sut, taskRepositoryStub } = makeSut()
    jest.spyOn(taskRepositoryStub, 'findTaskByTaskId').mockReturnValueOnce(Promise.resolve(null))

    const response = await sut.validate(request.body)

    expect(response).toBeUndefined()
  })
})
