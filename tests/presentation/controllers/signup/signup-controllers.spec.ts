import { ConflictParamError, InvalidParamError } from '@/application/usecases/errors'
import { makeSut } from './mocks/signup-controller-mock'

describe('SignUpController', () => {
  it('Should call findAccountByEmail with the correct value', async () => {
    const { sut, accountDbRepositoryStub, request } = makeSut()
    const findAccountByEmailSpy = jest.spyOn(accountDbRepositoryStub, 'findAccountByEmail')

    await sut.handle(request)

    expect(findAccountByEmailSpy).toHaveBeenCalledWith(request.body.email)
  })

  it('Should return conflict if email exists', async () => {
    const { sut, accountDbRepositoryStub, fakeUser, httpHelper, request } = makeSut()
    const error = new ConflictParamError('email')
    jest
      .spyOn(accountDbRepositoryStub, 'findAccountByEmail')
      .mockReturnValueOnce(Promise.resolve(fakeUser))

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.conflict(error))
  })

  it('Should call the saveAccount with correct values', async () => {
    const { sut, accountDbRepositoryStub, request } = makeSut()
    const saveAccountSpy = jest.spyOn(accountDbRepositoryStub, 'saveAccount')

    await sut.handle(request)

    expect(saveAccountSpy).toHaveBeenCalledWith(request.body)
  })

  it('Should call validate with correct values', async () => {
    const { sut, accountValidatorStub, request } = makeSut()
    const validateSpy = jest.spyOn(accountValidatorStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  it('Should call badRequest with the correct value', async () => {
    const { sut, accountValidatorStub, httpHelper, request } = makeSut()

    const error = new Error('any_error')
    jest.spyOn(accountValidatorStub, 'validate').mockReturnValueOnce(error)

    const badRequestSpy = jest.spyOn(httpHelper, 'badRequest')

    await sut.handle(request)

    expect(badRequestSpy).toHaveBeenCalledWith(error)
  })

  it('Should return badRequest if validation fails with an error message', async () => {
    const { sut, accountValidatorStub, httpHelper, request } = makeSut()
    const error = new InvalidParamError('any_field')
    jest.spyOn(accountValidatorStub, 'validate').mockReturnValueOnce(error)

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.badRequest(error))
  })

  it('Should call ok with the correct value', async () => {
    const { sut, fakePublicUser, httpHelper, request } = makeSut()
    const okSpy = jest.spyOn(httpHelper, 'ok')

    await sut.handle(request)

    expect(okSpy).toHaveBeenCalledWith({ user: fakePublicUser })
  })

  it('Should return ok if validation succeds', async () => {
    const { sut, fakePublicUser, httpHelper, request } = makeSut()

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.ok({ user: fakePublicUser }))
  })
})
