import { IValidator } from '@/domain/validators'
import { InvalidParamError, InvalidTypeError } from '@/application/errors'
import { ValidateName } from '@/application/validators/user'
import { HttpRequest } from '@/presentation/http/protocols'
import faker from 'faker'

interface SutTypes {
  request: HttpRequest
  sut: IValidator
}

const makeSut = (): SutTypes => {
  const request: HttpRequest = { body: { name: faker.name.findName() } }

  const sut = new ValidateName()

  return { request, sut }
}

describe('validateName', () => {
  it('should return InvalidTypeError if name is not a string', async () => {
    const { request, sut } = makeSut()
    request.body.name = 123

    const result = await sut.validate(request.body)

    expect(result).toStrictEqual(new InvalidTypeError('name'))
  })

  it('should return InvalidParamError if name is invalid with symbols', () => {
    const { request, sut } = makeSut()
    request.body.name = 'Ex@mple'

    const value = sut.validate(request.body)

    expect(value).toStrictEqual(new InvalidParamError('name'))
  })

  it('should return InvalidParamError if name is invalid with numbers', () => {
    const { request, sut } = makeSut()
    request.body.name = 'Ex4mple n4me'

    const value = sut.validate(request.body)

    expect(value).toStrictEqual(new InvalidParamError('name'))
  })

  it('should return InvalidParamError if name is invalid with both numbers and symbols', () => {
    const { request, sut } = makeSut()
    request.body.name = 'Ex@mple n4me'

    const value = sut.validate(request.body)

    expect(value).toStrictEqual(new InvalidParamError('name'))
  })

  it('should return nothing if succeeds', () => {
    const { sut } = makeSut()
    const data = { name: faker.name.findName() }

    const value = sut.validate(data)

    expect(value).toBeUndefined()
  })
})
