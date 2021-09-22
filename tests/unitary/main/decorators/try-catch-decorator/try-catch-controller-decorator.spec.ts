import { makeSut } from './try-catch-controller-decorator-sut'

describe('LogControllerDecorator', () => {
  it('Should call handle with correct value', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const request = {}

    await sut.handle(request)

    expect(handleSpy).toHaveBeenCalledWith(request)
  })

  it('Should return a serverError as http response if statusCode is 500', async () => {
    const { sut, httpHelper, controllerStub } = makeSut()
    const error = new Error('any_message')
    jest.spyOn(controllerStub, 'handle').mockImplementationOnce(async () => Promise.reject(error))
    const errorData = {
      name: error.name,
      message: error.message,
      stack: error.stack
    }

    const promise = await sut.handle({})

    expect(promise).toEqual(httpHelper.serverError(errorData))
  })

  it('Should return a http response if succeds', async () => {
    const { sut, httpHelper } = makeSut()

    const promise = await sut.handle({})

    expect(promise).toEqual(httpHelper.ok({}))
  })
})
