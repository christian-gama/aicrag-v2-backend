import { UserCredentialError } from '@/application/usecases/errors'
import { makeSut } from './mocks/login-controller-mock'

describe('LoginController', () => {
  it('Should call validate with correct values', async () => {
    const { sut, credentialsValidatorStub, request } = makeSut()
    const validateSpy = jest.spyOn(credentialsValidatorStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  it('Should call notFound with the correct value', async () => {
    const { sut, httpHelper, credentialsValidatorStub, request } = makeSut()

    const error = new UserCredentialError()
    jest.spyOn(credentialsValidatorStub, 'validate').mockReturnValueOnce(error)

    const notFoundSpy = jest.spyOn(httpHelper, 'notFound')

    await sut.handle(request)

    expect(notFoundSpy).toHaveBeenCalledWith(error)
  })

  it('Should call findAccountByEmail with the correct value', async () => {
    const { sut, accountDbRepositoryStub, request } = makeSut()
    const findAccountByEmailSpy = jest.spyOn(accountDbRepositoryStub, 'findAccountByEmail')

    await sut.handle(request)

    expect(findAccountByEmailSpy).toHaveBeenCalledWith(request.body.email)
  })

  it('Should call the encryptId with correct values', async () => {
    const { sut, jwtAdapterStub, request, fakeUser } = makeSut()
    const encryptIdSpy = jest.spyOn(jwtAdapterStub, 'encryptId')

    await sut.handle(request)

    expect(encryptIdSpy).toHaveBeenCalledWith(fakeUser.personal.id)
  })

  it('Should call the filter with correct user', async () => {
    const { sut, filterUserDataStub, request, fakeUser } = makeSut()
    const filterSpy = jest.spyOn(filterUserDataStub, 'filter')

    await sut.handle(request)

    expect(filterSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('Should call ok with the correct value', async () => {
    const { sut, fakePublicUser, httpHelper, request } = makeSut()
    const okSpy = jest.spyOn(httpHelper, 'ok')

    await sut.handle(request)

    expect(okSpy).toHaveBeenCalledWith({ user: fakePublicUser, accessToken: 'any_token' })
  })

  it('Should return ok if validation succeds', async () => {
    const { sut, request, httpHelper, fakePublicUser } = makeSut()

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.ok({ user: fakePublicUser, accessToken: 'any_token' }))
  })
})