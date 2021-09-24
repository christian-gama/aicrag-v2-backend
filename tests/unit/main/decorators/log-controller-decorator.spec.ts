import { LogErrorDbRepositoryProtocol } from '@/application/protocols/repositories'

import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'
import { HttpHelper } from '@/presentation/helpers/http/http-helper'

import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator'
import { makeHttpHelper } from '@/main/factories/helpers'

import { makeControllerStub, makeLogErrorDbRepositoryStub } from '@/tests/__mocks__'

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: ControllerProtocol
  error: Error
  httpHelper: HttpHelper
  logErrorDbRepositoryStub: LogErrorDbRepositoryProtocol
}

const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub()
  const error = new Error('any_message')
  const httpHelper = makeHttpHelper()
  const logErrorDbRepositoryStub = makeLogErrorDbRepositoryStub(error)

  const sut = new LogControllerDecorator(controllerStub, logErrorDbRepositoryStub)

  return { sut, controllerStub, error, httpHelper, logErrorDbRepositoryStub }
}

describe('LogControllerDecorator', () => {
  it('Should call logErrorDbRepository with correct error', async () => {
    const { sut, controllerStub, error, httpHelper, logErrorDbRepositoryStub } = makeSut()
    const errorData = {
      name: error.name,
      message: error.message,
      stack: error.stack
    }
    const saveLogSpy = jest.spyOn(logErrorDbRepositoryStub, 'saveLog')
    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(Promise.resolve(httpHelper.serverError(error)))

    await sut.handle({})

    expect(saveLogSpy).toHaveBeenCalledWith(errorData)
  })

  it('Should return a serverError as http response if statusCode is 500', async () => {
    const { sut, controllerStub, error, httpHelper } = makeSut()
    const errorData = {
      message: error.message,
      name: error.name,
      stack: error.stack
    }
    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(Promise.resolve(httpHelper.serverError(error)))

    const response = await sut.handle({})

    expect(response).toEqual(httpHelper.serverError(errorData))
  })

  it('Should return any http response', async () => {
    const { sut } = makeSut()

    const response = await sut.handle({})

    expect(response.data).toBeTruthy()
    expect(response.status).toBeTruthy()
    expect(response.statusCode).toBeTruthy()
  })
})
