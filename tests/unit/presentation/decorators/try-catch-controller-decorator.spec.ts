import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'
import { TryCatchDecorator } from '@/presentation/decorators'
import { HttpHelper } from '@/presentation/http/http-helper'

import { makeHttpHelper } from '@/factories/helpers'

import { makeControllerStub } from '@/tests/__mocks__'

interface SutTypes {
  controllerStub: ControllerProtocol
  httpHelper: HttpHelper
  sut: TryCatchDecorator<ControllerProtocol>
}

const makeSut = (): SutTypes => {
  const httpHelper = makeHttpHelper()
  const controllerStub = makeControllerStub()

  const sut = new TryCatchDecorator(controllerStub)

  return { controllerStub, httpHelper, sut }
}

describe('logDecorator', () => {
  it('should call handle with correct value', async () => {
    expect.hasAssertions()

    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const request = {}

    await sut.handle(request)

    expect(handleSpy).toHaveBeenCalledWith(request)
  })

  it('should return a serverError as http response if statusCode is 500', async () => {
    expect.hasAssertions()

    const { controllerStub, httpHelper, sut } = makeSut()
    const error = new Error('any_message')
    const errorData = {
      message: error.message,
      name: error.name,
      stack: error.stack
    }
    jest
      .spyOn(controllerStub, 'handle')
      .mockImplementationOnce(async () => await Promise.reject(error))

    const promise = await sut.handle({})

    expect(promise).toStrictEqual(httpHelper.serverError(errorData))
  })

  it('should return a http response if succeeds', async () => {
    expect.hasAssertions()

    const { httpHelper, sut } = makeSut()

    const promise = await sut.handle({})

    expect(promise).toStrictEqual(httpHelper.ok({}))
  })
})
