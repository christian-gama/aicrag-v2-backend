import { makeSut } from './refresh-token-repository-sut'

describe('RefreshTokenRepository', () => {
  it('Should return a RefreshToken', () => {
    const { sut, fakeUser } = makeSut()

    const refreshToken = sut.createRefreshToken(fakeUser)

    expect(refreshToken.id).toBe('any_id')
    expect(typeof refreshToken.expiresIn).toBe('object')
    expect(refreshToken.user).toEqual(fakeUser)
    expect(refreshToken.userId).toBe(fakeUser.personal.id)
  })
})
