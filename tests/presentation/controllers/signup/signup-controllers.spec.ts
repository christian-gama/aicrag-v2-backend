import { InvalidParamError } from '@/application/usecases/errors'
import { fakeValidAccount } from '@/tests/domain/mocks/account-mock'
import { makeSut } from './mocks/signup-controller-mock'

describe('SignUpController', () => {
  it('Should call the saveAccount with correct values', async () => {
    const { sut, accountDbRepositoryStub } = makeSut()
    const saveAccountSpy = jest.spyOn(accountDbRepositoryStub, 'saveAccount')
    const request = { body: fakeValidAccount }

    await sut.handle(request)

    expect(saveAccountSpy).toHaveBeenCalledWith(request.body)
  })

  it('Should call validate with correct values', async () => {
    const { sut, accountValidatorStub } = makeSut()
    const validateSpy = jest.spyOn(accountValidatorStub, 'validate')
    const request = { body: fakeValidAccount }

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  it('Should return a bad request if validation fails with an error message', async () => {
    const { sut, accountValidatorStub } = makeSut()
    const error = new InvalidParamError('any_field')
    jest.spyOn(accountValidatorStub, 'validate').mockReturnValueOnce(error)
    const request = { body: fakeValidAccount }

    const response = await sut.handle(request)

    expect(response).toEqual({ statusCode: 400, data: { message: error.message } })
  })

  it('Should return a user if validation succeds', async () => {
    const { sut, fakeUser } = makeSut()
    const request = {
      body: {
        name: fakeUser.personal.name,
        email: fakeUser.personal.email,
        password: fakeUser.personal.password,
        passwordConfirmation: fakeUser.personal.password
      }
    }

    const response = await sut.handle(request)

    expect(response.data.user.personal.name).toBe(request.body.name)
    expect(response.data.user.personal.email).toBe(request.body.email)
  })

  it('Should call ok with the correct value', async () => {
    const { sut, fakeUser, httpHelper } = makeSut()
    const okSpy = jest.spyOn(httpHelper, 'ok')
    const request = {
      body: {
        name: fakeUser.personal.name,
        email: fakeUser.personal.email,
        password: fakeUser.personal.password,
        passwordConfirmation: fakeUser.personal.password
      }
    }

    await sut.handle(request)

    expect(okSpy).toHaveBeenCalledWith({ user: fakeUser })
  })
})
