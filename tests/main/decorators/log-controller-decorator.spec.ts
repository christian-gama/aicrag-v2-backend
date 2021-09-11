import { makeSut } from './mocks/log-controller-decorator-mock'

describe('LogControllerDecorator', () => {
  it('Should call logErrorDbRepository with correct error', async () => {
    const { sut, error, logErrorDbRepositoryStub } = makeSut()
    const saveLogSpy = jest.spyOn(logErrorDbRepositoryStub, 'saveLog')

    await sut.handle({})

    expect(saveLogSpy).toHaveBeenCalledWith(error)
  })
})
