import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'
import { HttpHelper } from '@/presentation/helpers/http/http-helper'

import { TryCatchControllerDecorator } from '@/main/decorators/try-catch-controller-decorator'
import { makeHttpHelper } from '@/main/factories/helpers'

import { makeControllerStub } from '@/tests/__mocks__'

interface SutTypes {
  sut: TryCatchControllerDecorator
  controllerStub: ControllerProtocol
  httpHelper: HttpHelper
}

const makeSut = (): SutTypes => {
  const httpHelper = makeHttpHelper()
  const controllerStub = makeControllerStub()

  const sut = new TryCatchControllerDecorator(controllerStub)

  return { sut, controllerStub, httpHelper }
}

describe('LogControllerDecorator', () => {
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
      name: error.name,
      message: error.message,
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
