import { InvalidCodeError } from '@/application/usecases/errors'
import { makeFakePublicUser } from '@/tests/__mocks__/domain/mock-public-user'
import { makeFakeRefreshToken } from '@/tests/__mocks__/domain/mock-refresh-token'
import { makeSut } from './activate-account-controller-sut'

describe('LoginController', () => {
  it('Should call validate with correct values', async () => {
    const { sut, activateAccountValidatorStub, request } = makeSut()
    const validateSpy = jest.spyOn(activateAccountValidatorStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  it('Should return unauthorized if validation fails', async () => {
    const { sut, activateAccountValidatorStub, httpHelper, request } = makeSut()
    const error = new InvalidCodeError()
    jest.spyOn(activateAccountValidatorStub, 'validate').mockReturnValueOnce(error)

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.unauthorized(error))
  })

  it('Should call findUserByEmail with correct email', async () => {
    const { sut, userDbRepositoryStub, request } = makeSut()
    const findUserByEmailSpy = jest.spyOn(userDbRepositoryStub, 'findUserByEmail')

    await sut.handle(request)

    expect(findUserByEmailSpy).toHaveBeenCalledWith(request.body.email)
  })

  it('Should call filter with correct user', async () => {
    const { sut, fakeUser, filterUserDataStub, request } = makeSut()
    const filterSpy = jest.spyOn(filterUserDataStub, 'filter')

    await sut.handle(request)

    expect(filterSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('Should call jwtAccessToken.encrypt with correct values', async () => {
    const { sut, fakeUser, jwtAccessToken, request } = makeSut()

    const encryptSpy = jest.spyOn(jwtAccessToken, 'encrypt')

    await sut.handle(request)

    expect(encryptSpy).toHaveBeenCalledWith('id', fakeUser.personal.id)
  })

  it('Should call jwtRefreshToken.encrypt with correct values', async () => {
    const { sut, jwtRefreshToken, refreshTokenDbRepositoryStub, request } = makeSut()
    const fakeRefreshToken = makeFakeRefreshToken()
    jest
      .spyOn(refreshTokenDbRepositoryStub, 'saveRefreshToken')
      .mockReturnValueOnce(Promise.resolve(fakeRefreshToken))
    const encryptSpy = jest.spyOn(jwtRefreshToken, 'encrypt')

    await sut.handle(request)

    expect(encryptSpy).toHaveBeenCalledWith('id', fakeRefreshToken.id)
  })

  it('Should call ok with correct values', async () => {
    const { sut, fakeUser, httpHelper, request } = makeSut()
    const filteredUser = makeFakePublicUser(fakeUser)
    const okSpy = jest.spyOn(httpHelper, 'ok')

    await sut.handle(request)

    expect(okSpy).toHaveBeenCalledWith({
      user: filteredUser,
      refreshToken: 'any_token',
      accessToken: 'any_token'
    })
  })

  it('Should activate account if validation succeds', async () => {
    const { sut, fakeUser, request } = makeSut()

    await sut.handle(request)

    expect(fakeUser.settings.accountActivated).toBe(true)
  })

  it('Should clear temporaries if validation succeds', async () => {
    const { sut, fakeUser, request } = makeSut()

    await sut.handle(request)

    expect(fakeUser.temporary.activationCode).toBe(null)
    expect(fakeUser.temporary.activationCodeExpiration).toBe(null)
  })

  it('Should call updateUser twice', async () => {
    const { sut, userDbRepositoryStub, request } = makeSut()
    const updateUserSpy = jest.spyOn(userDbRepositoryStub, 'updateUser')

    await sut.handle(request)

    expect(updateUserSpy).toHaveBeenCalledTimes(2)
  })
})
