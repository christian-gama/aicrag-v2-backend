import { InvalidCodeError } from '@/application/usecases/errors'
import { makeFakePublicUser } from '@/tests/domain/__mocks__/public-user-mock'
import { makeSut } from './__mocks__/activate-account-controller-mock'

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

  it('Should call findAccountByEmail with correct email', async () => {
    const { sut, accountDbRepositoryStub, request } = makeSut()
    const findAccountByEmailSpy = jest.spyOn(accountDbRepositoryStub, 'findAccountByEmail')

    await sut.handle(request)

    expect(findAccountByEmailSpy).toHaveBeenCalledWith(request.body.email)
  })

  it('Should call filter with correct user', async () => {
    const { sut, fakeUser, filterUserDataStub, request } = makeSut()
    const filterSpy = jest.spyOn(filterUserDataStub, 'filter')

    await sut.handle(request)

    expect(filterSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('Should call encryptId with correct id', async () => {
    const { sut, fakeUser, jwtAdapterStub, request } = makeSut()
    const encryptIdSpy = jest.spyOn(jwtAdapterStub, 'encryptId')

    await sut.handle(request)

    expect(encryptIdSpy).toHaveBeenCalledWith(fakeUser.personal.id)
  })

  it('Should call ok with correct values', async () => {
    const { sut, fakeUser, httpHelper, request } = makeSut()
    const filteredUser = makeFakePublicUser(fakeUser)
    const okSpy = jest.spyOn(httpHelper, 'ok')

    await sut.handle(request)

    expect(okSpy).toHaveBeenCalledWith({ user: filteredUser }, 'any_token')
  })

  it('Should activate account if validation succeds', async () => {
    const { sut, fakeUser, request } = makeSut()

    await sut.handle(request)

    expect(fakeUser.settings.accountActivated).toBe(true)
  })

  it('Should clear temporaries if validation succeds', async () => {
    const { sut, fakeUser, request } = makeSut()

    await sut.handle(request)

    expect(fakeUser.temporary?.activationCode).toBe(undefined)
    expect(fakeUser.temporary?.activationCodeExpiration).toBe(undefined)
  })

  it('Should call updateUser twice', async () => {
    const { sut, accountDbRepositoryStub, request } = makeSut()
    const updateUserSpy = jest.spyOn(accountDbRepositoryStub, 'updateUser')

    await sut.handle(request)

    expect(updateUserSpy).toHaveBeenCalledTimes(2)
  })
})
