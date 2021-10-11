import { InvalidQueryError } from '@/application/errors'
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
  it('should return InvalidQueryError if taskId is not a string', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.query.taskId = ['a', 'b']

    const error = await sut.validate(request.query)

    expect(error).toStrictEqual(new InvalidQueryError('taskId'))
  })

  it('should return InvalidQueryError if taskId is longer than 120 characters', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.query.taskId =
      'this_is_a_really_really_really_really_really_really_really_really_really_really_really_really_really_really_really_long_string'

    const error = await sut.validate(request.query)

    expect(error).toStrictEqual(new InvalidQueryError('taskId'))
  })

  it('should return undefined if succeeds', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()

    const response = await sut.validate(request.query)

    expect(response).toBeUndefined()
  })
})
