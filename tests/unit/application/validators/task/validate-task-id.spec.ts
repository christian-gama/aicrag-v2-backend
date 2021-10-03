import { InvalidParamError } from '@/application/errors'
import { ValidateTaskId } from '@/application/validators/task'

import { HttpRequest } from '@/presentation/http/protocols'

import faker from 'faker'

interface SutTypes {
  request: HttpRequest
  sut: ValidateTaskId
}

const makeSut = (): SutTypes => {
  const request: HttpRequest = {
    body: { taskId: faker.random.alphaNumeric(100) }
  }

  const sut = new ValidateTaskId()

  return { request, sut }
}

describe('validateTaskId', () => {
  it('should return InvalidParamError if taskId length is greater than 120', () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.body.taskId = faker.random.alphaNumeric(121)

    const error = sut.validate(request.body)

    expect(error).toStrictEqual(new InvalidParamError('taskId'))
  })

  it('should return undefined if succeds', () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()

    const response = sut.validate(request.body)

    expect(response).toBeUndefined()
  })

  it('should return undefined if taskId is null', () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.body.taskId = null

    const response = sut.validate(request.body)

    expect(response).toBeUndefined()
  })
})
