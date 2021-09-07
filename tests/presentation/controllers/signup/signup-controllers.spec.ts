import { InvalidParamError } from '@/application/usecases/errors'
import { makeSut } from './mocks/signup-controller-mock'

describe('SignUpController', () => {
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

  it('Should return a bad request if validation fails with an error message', async () => {
    const { sut, accountValidatorStub, request } = makeSut()
    const error = new InvalidParamError('any_field')
    jest.spyOn(accountValidatorStub, 'validate').mockReturnValueOnce(error)

    const response = await sut.handle(request)

    expect(response).toEqual({ statusCode: 400, data: { message: error.message } })
  })

  it('Should return a user if validation succeds', async () => {
    const { sut, request } = makeSut()

    const response = await sut.handle(request)

    expect(response.data.user.personal.name).toBe(request.body.name)
    expect(response.data.user.personal.email).toBe(request.body.email)
  })

  it('Should call ok with the correct value', async () => {
    const { sut, fakeUser, httpHelper, request } = makeSut()
    const okSpy = jest.spyOn(httpHelper, 'ok')

    await sut.handle(request)

    expect(okSpy).toHaveBeenCalledWith({ user: fakeUser })
  })

  it('Should call badRequest with the correct value', async () => {
    const { sut, httpHelper, accountValidatorStub, request } = makeSut()

    const error = new Error('any_error')
    jest.spyOn(accountValidatorStub, 'validate').mockReturnValueOnce(error)

    const badRequestSpy = jest.spyOn(httpHelper, 'badRequest')

    await sut.handle(request)

    expect(badRequestSpy).toHaveBeenCalledWith(error)
  })
})
