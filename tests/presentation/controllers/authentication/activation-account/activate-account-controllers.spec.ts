import { InvalidCodeError } from '@/application/usecases/errors'
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
})
