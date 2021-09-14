import { makeSut } from './refresh-token-repository-sut'

describe('RefreshTokenRepository', () => {
  it('Should return a RefreshToken', () => {
    const { sut, fakeUser } = makeSut()

    const refreshToken = sut.createRefreshToken(fakeUser)

    expect(refreshToken.id).toBe('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx')
    expect(typeof refreshToken.expiresIn).toBe('object')
    expect(refreshToken.user).toEqual(fakeUser)
    expect(refreshToken.userId).toBe(fakeUser.personal.id)
  })

  it('Should call generate', () => {
    const { sut, fakeUser, uuidStub } = makeSut()
    const generateSpy = jest.spyOn(uuidStub, 'generate')

    sut.createRefreshToken(fakeUser)

    expect(generateSpy).toHaveBeenCalled()
  })
})
