import { ILogErrorRepository } from '@/domain/repositories'
import { IController } from '@/presentation/controllers/protocols/controller.model'
import { LogDecorator } from '@/presentation/decorators'
import { HttpHelper } from '@/presentation/http/http-helper'
import { makeHttpHelper } from '@/main/factories/helpers'
import { makeControllerStub, makeLogErrorRepositoryStub } from '@/tests/__mocks__'

interface SutTypes {
  controllerStub: IController
  error: Error
  httpHelper: HttpHelper
  logErrorRepositoryStub: ILogErrorRepository
  sut: LogDecorator<IController>
}

const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub()
  const error = new Error('any_message')
  const httpHelper = makeHttpHelper()
  const logErrorRepositoryStub = makeLogErrorRepositoryStub(error)

  const sut = new LogDecorator(controllerStub, logErrorRepositoryStub)

  return { controllerStub, error, httpHelper, logErrorRepositoryStub, sut }
}

describe('logDecorator', () => {
  it('should call logErrorRepository with correct error', async () => {
    const { controllerStub, error, httpHelper, logErrorRepositoryStub, sut } = makeSut()
    const errorData = {
      message: error.message,
      name: error.name,
      stack: error.stack
    }
    const saveLogSpy = jest.spyOn(logErrorRepositoryStub, 'save')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(httpHelper.serverError(error)))

    await sut.handle({})

    expect(saveLogSpy).toHaveBeenCalledWith(errorData)
  })

  it('should return a serverError as http response if statusCode is 500', async () => {
    const { controllerStub, error, httpHelper, sut } = makeSut()
    const errorData = {
      message: error.message,
      name: error.name,
      stack: error.stack
    }
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(httpHelper.serverError(error)))

    const result = await sut.handle({})

    expect(result).toStrictEqual(httpHelper.serverError(errorData))
  })

  it('should return any http response', async () => {
    const { sut } = makeSut()

    const result = await sut.handle({})

    expect(result.data).toBeTruthy()
    expect(result.status).toBeTruthy()
    expect(result.statusCode).toBeTruthy()
  })
})
