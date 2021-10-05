import { LogErrorDbRepositoryProtocol } from '@/domain/repositories'

import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'
import { LogDecorator } from '@/presentation/decorators'
import { HttpHelper } from '@/presentation/http/http-helper'

import { makeHttpHelper } from '@/factories/helpers'

import { makeControllerStub, makeLogErrorDbRepositoryStub } from '@/tests/__mocks__'

interface SutTypes {
  controllerStub: ControllerProtocol
  error: Error
  httpHelper: HttpHelper
  logErrorDbRepositoryStub: LogErrorDbRepositoryProtocol
  sut: LogDecorator<ControllerProtocol>
}

const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub()
  const error = new Error('any_message')
  const httpHelper = makeHttpHelper()
  const logErrorDbRepositoryStub = makeLogErrorDbRepositoryStub(error)

  const sut = new LogDecorator(controllerStub, logErrorDbRepositoryStub)

  return { controllerStub, error, httpHelper, logErrorDbRepositoryStub, sut }
}

describe('logDecorator', () => {
  it('should call logErrorDbRepository with correct error', async () => {
    expect.hasAssertions()

    const { controllerStub, error, httpHelper, logErrorDbRepositoryStub, sut } = makeSut()
    const errorData = {
      message: error.message,
      name: error.name,
      stack: error.stack
    }
    const saveLogSpy = jest.spyOn(logErrorDbRepositoryStub, 'saveLog')
    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(Promise.resolve(httpHelper.serverError(error)))

    await sut.handle({})

    expect(saveLogSpy).toHaveBeenCalledWith(errorData)
  })

  it('should return a serverError as http response if statusCode is 500', async () => {
    expect.hasAssertions()

    const { controllerStub, error, httpHelper, sut } = makeSut()
    const errorData = {
      message: error.message,
      name: error.name,
      stack: error.stack
    }
    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(Promise.resolve(httpHelper.serverError(error)))

    const response = await sut.handle({})

    expect(response).toStrictEqual(httpHelper.serverError(errorData))
  })

  it('should return any http response', async () => {
    expect.hasAssertions()

    const { sut } = makeSut()

    const response = await sut.handle({})

    expect(response.data).toBeTruthy()
    expect(response.status).toBeTruthy()
    expect(response.statusCode).toBeTruthy()
  })
})
