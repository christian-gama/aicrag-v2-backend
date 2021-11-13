import { ITask, IUser } from '@/domain'
import { InvalidParamError, InvalidTypeError } from '@/application/errors'
import { ValidateTaskId } from '@/application/validators/task'
import { HttpRequest } from '@/presentation/http/protocols'
import { makeFakeTask, makeFakeUser } from '@/tests/__mocks__'
import faker from 'faker'

interface SutTypes {
  fakeTask: ITask
  fakeUser: IUser
  request: HttpRequest
  sut: ValidateTaskId
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const fakeTask = makeFakeTask(fakeUser)
  const request: HttpRequest = {
    body: { taskId: faker.random.alphaNumeric(100) }
  }

  const sut = new ValidateTaskId()

  return { fakeTask, fakeUser, request, sut }
}

describe('validateTaskId', () => {
  it('should return InvalidTypeError if taskId is not a string', async () => {
    const { request, sut } = makeSut()
    request.body.taskId = 123

    const result = await sut.validate(request.body)

    expect(result).toStrictEqual(new InvalidTypeError('taskId', 'string', typeof request.body.taskId))
  })

  it('should return InvalidParamError if taskId length is greater than 120', async () => {
    const { request, sut } = makeSut()
    request.body.taskId = faker.random.alphaNumeric(121)

    const result = await sut.validate(request.body)

    expect(result).toStrictEqual(new InvalidParamError('taskId'))
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
