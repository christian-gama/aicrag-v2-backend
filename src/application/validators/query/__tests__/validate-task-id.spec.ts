import { InvalidParamError, InvalidTypeError } from '@/application/errors'
import { ValidateTaskId } from '@/application/validators/query'
import { HttpRequest } from '@/presentation/http/protocols'

interface SutTypes {
  request: HttpRequest
  sut: ValidateTaskId
}
const makeSut = (): SutTypes => {
  const request: HttpRequest = { query: { taskId: 'any_task_id' } }

  const sut = new ValidateTaskId()

  return { request, sut }
}

describe('validateTaskId', () => {
  it('should return InvalidTypeError if taskId is not a string', async () => {
    const { request, sut } = makeSut()
    request.query.taskId = ['a', 'b']

    const result = await sut.validate(request.query)

    expect(result).toStrictEqual(new InvalidTypeError('taskId', 'string', typeof request.query.taskId))
  })

  it('should return InvalidParamError if taskId is longer than 120 characters', async () => {
    const { request, sut } = makeSut()
    request.query.taskId =
      'this_is_a_really_really_really_really_really_really_really_really_really_really_really_really_really_really_really_long_string'

    const result = await sut.validate(request.query)

    expect(result).toStrictEqual(new InvalidParamError('taskId'))
  })

  it('should return undefined if succeeds', async () => {
    const { request, sut } = makeSut()

    const result = await sut.validate(request.query)

    expect(result).toBeUndefined()
  })
})
