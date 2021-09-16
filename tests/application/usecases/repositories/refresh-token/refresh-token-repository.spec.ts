import { makeSut } from './refresh-token-repository-sut'

describe('RefreshTokenRepository', () => {
  it('Should return a RefreshToken', async () => {
    const { sut, fakeUser } = makeSut()

    const refreshToken = await sut.createRefreshToken(fakeUser.personal.id)

    expect(refreshToken.id).toBe('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx')
    expect(typeof refreshToken.expiresIn).toBe('object')
    expect(refreshToken.userId).toBe('hashed_value')
  })

  it('Should call generate', async () => {
    const { sut, fakeUser, uuidStub } = makeSut()
    const generateSpy = jest.spyOn(uuidStub, 'generate')

    await sut.createRefreshToken(fakeUser.personal.id)

    expect(generateSpy).toHaveBeenCalled()
  })

  it('Should call hasher with correct values', async () => {
    const { sut, fakeUser, hasher } = makeSut()
    const hashSpy = jest.spyOn(hasher, 'hash')

    await sut.createRefreshToken(fakeUser.personal.id)

    expect(hashSpy).toHaveBeenCalledWith(fakeUser.personal.id)
  })
})
