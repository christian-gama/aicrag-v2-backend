import { makeSut } from './mocks/log-error-db-repository-mock'

describe('LogErrorDbRepository', () => {
  it('Should call createLog with correct error', async () => {
    const { sut, error, logErrorRepositoryStub } = makeSut()
    const createLogSpy = jest.spyOn(logErrorRepositoryStub, 'createLog')

    await sut.saveLog(error)

    expect(createLogSpy).toHaveBeenCalledWith(error)
  })
})
