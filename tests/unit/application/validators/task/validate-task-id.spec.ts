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

  console.log(request.body.taskId)

  const sut = new ValidateTaskId()

  return { request, sut }
}

describe('validateTaskId', () => {
  it('should return InvalidParamError if taskId length is greater than 120', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.body.taskId = faker.random.alphaNumeric(121)

    const error = await sut.validate(request.body)

    expect(error).toStrictEqual(new InvalidParamError('taskId'))
  })
})
