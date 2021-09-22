import { makeSut } from './log-controller-decorator-sut'

describe('LogControllerDecorator', () => {
  it('Should call logErrorDbRepository with correct error', async () => {
    const { sut, controllerStub, error, httpHelper, logErrorDbRepositoryStub } = makeSut()
    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(Promise.resolve(httpHelper.serverError(error)))
    const saveLogSpy = jest.spyOn(logErrorDbRepositoryStub, 'saveLog')
    const errorData = {
      name: error.name,
      message: error.message,
      stack: error.stack
    }

    await sut.handle({})

    expect(saveLogSpy).toHaveBeenCalledWith(errorData)
  })

  it('Should return a serverError as http response if statusCode is 500', async () => {
    const { sut, controllerStub, error, httpHelper } = makeSut()
    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(Promise.resolve(httpHelper.serverError(error)))
    const errorData = {
      name: error.name,
      message: error.message,
      stack: error.stack
    }

    const response = await sut.handle({})

    expect(response).toEqual(httpHelper.serverError(errorData))
  })

  it('Should return any http response', async () => {
    const { sut } = makeSut()

    const response = await sut.handle({})

    expect(response.status).toBeTruthy()
    expect(response.data).toBeTruthy()
    expect(response.statusCode).toBeTruthy()
  })
})
