import { makeSut } from './refresh-token-db-repository-sut'

describe('RefreshTokenDbRepository', () => {
  it('Should call createRefreshToken with correct user', async () => {
    const { sut, fakeUser, refreshTokenRepositoryStub } = makeSut()
    const createRefreshTokenSpy = jest.spyOn(refreshTokenRepositoryStub, 'createRefreshToken')

    await sut.saveRefreshToken(fakeUser)

    expect(createRefreshTokenSpy).toHaveBeenCalledWith(fakeUser)
  })
})
