import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'
import { HttpHelper } from '@/presentation/helpers/http/http-helper'

import { TryCatchDecorator } from '@/main/decorators'
import { makeHttpHelper } from '@/main/factories/helpers'

import { makeControllerStub } from '@/tests/__mocks__'

interface SutTypes {
  sut: TryCatchDecorator<ControllerProtocol>
  controllerStub: ControllerProtocol
  httpHelper: HttpHelper
}

const makeSut = (): SutTypes => {
  const httpHelper = makeHttpHelper()
  const controllerStub = makeControllerStub()

  const sut = new TryCatchDecorator(controllerStub)

  return { sut, controllerStub, httpHelper }
}

describe('LogDecorator', () => {
  it('Should call handle with correct value', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const request = {}

    await sut.handle(request)

    expect(handleSpy).toHaveBeenCalledWith(request)
  })

  it('Should return a serverError as http response if statusCode is 500', async () => {
    const { sut, controllerStub, httpHelper } = makeSut()
    const error = new Error('any_message')
    const errorData = {
      message: error.message,
      name: error.name,
      stack: error.stack
    }
    jest.spyOn(controllerStub, 'handle').mockImplementationOnce(async () => Promise.reject(error))

    const promise = await sut.handle({})

    expect(promise).toEqual(httpHelper.serverError(errorData))
  })

  it('Should return a http response if succeds', async () => {
    const { sut, httpHelper } = makeSut()

    const promise = await sut.handle({})

    expect(promise).toEqual(httpHelper.ok({}))
  })
})
