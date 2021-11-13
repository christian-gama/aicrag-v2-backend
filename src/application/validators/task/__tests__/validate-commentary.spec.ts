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
    const { request, sut } = makeSut()
    request.body.commentary = 123

    const result = sut.validate(request.body)

    expect(result).toStrictEqual(new InvalidTypeError('commentary', 'string', typeof request.body.commentary))
  })

  it('should return InvalidParamError if commentary length is greater than 400', () => {
    const { request, sut } = makeSut()
    request.body.commentary = faker.random.alphaNumeric(401)

    const result = sut.validate(request.body)

    expect(result).toStrictEqual(new InvalidParamError('commentary'))
  })

  it('should return undefined if commentary is null', () => {
    const { request, sut } = makeSut()
    request.body.commentary = null

    const result = sut.validate(request.body)

    expect(result).toBeUndefined()
  })

  it('should return undefined if commentary is valid', () => {
    const { request, sut } = makeSut()

    const result = sut.validate(request.body)

    expect(result).toBeUndefined()
  })
})
