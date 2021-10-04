import { InvalidParamError, InvalidTypeError } from '@/application/errors'
import { ValidateCommentary } from '@/application/validators/task'

import { HttpRequest } from '@/presentation/http/protocols'

import faker from 'faker'

interface SutTypes {
  request: HttpRequest
  sut: ValidateCommentary
}
const makeSut = (): SutTypes => {
  const request: HttpRequest = { body: { commentary: faker.random.alphaNumeric(400) } }

  const sut = new ValidateCommentary()

  return { request, sut }
}

describe('validateCommentary', () => {
  it('should return InvalidTypeError if commentary is not a string', () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.body.commentary = 123

    const error = sut.validate(request.body)

    expect(error).toStrictEqual(new InvalidTypeError('commentary'))
  })

  it('should return InvalidParamError if commentary length is greater than 400', () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.body.commentary = faker.random.alphaNumeric(401)

    const error = sut.validate(request.body)

    expect(error).toStrictEqual(new InvalidParamError('commentary'))
  })

  it('should return undefined if commentary is null', () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.body.commentary = null

    const error = sut.validate(request.body)

    expect(error).toBeUndefined()
  })

  it('should return undefined if commentary is valid', () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()

    const error = sut.validate(request.body)

    expect(error).toBeUndefined()
  })
})
