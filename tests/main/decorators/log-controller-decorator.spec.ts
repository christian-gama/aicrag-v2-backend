import { makeSut } from './mocks/log-controller-decorator-mock'

describe('LogControllerDecorator', () => {
  it('Should call logErrorDbRepository with correct error', async () => {
    const { sut, error, logErrorDbRepositoryStub } = makeSut()
    const saveLogSpy = jest.spyOn(logErrorDbRepositoryStub, 'saveLog')

    await sut.handle({})

    expect(saveLogSpy).toHaveBeenCalledWith(error)
  })

  it('Should return a serverError as http response if statusCode is 500', async () => {
    const { sut, error, httpHelper } = makeSut()

    const response = await sut.handle({})

    expect(response).toEqual(httpHelper.serverError(error))
  })
})
