import { IUser } from '@/domain'
import { IFilterUserData } from '@/domain/helpers'
import { IGenerateToken } from '@/domain/providers'
import { IUserRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'

import { MustLogoutError } from '@/application/errors'

import { ForgotPasswordController } from '@/presentation/controllers/login'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/http/protocols'

import { makeHttpHelper } from '@/factories/helpers'

import {
  makeFakeUser,
  makeValidatorStub,
  makeGenerateTokenStub,
  makeUserRepositoryStub,
  makeFilterUserDataStub,
  makeFakePublicUser
} from '@/tests/__mocks__'

interface SutTypes {
  fakeUser: IUser
  filterUserDataStub: IFilterUserData
  forgotPasswordValidatorStub: IValidator
  generateTokenStub: IGenerateToken
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  sut: ForgotPasswordController
  userRepositoryStub: IUserRepository
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const filterUserDataStub = makeFilterUserDataStub(fakeUser)
  const forgotPasswordValidatorStub = makeValidatorStub()
  const generateTokenStub = makeGenerateTokenStub()
  const httpHelper = makeHttpHelper()
  const request = { body: { email: fakeUser.personal.email } }
  const userRepositoryStub = makeUserRepositoryStub(fakeUser)

  const sut = new ForgotPasswordController(
    filterUserDataStub,
    forgotPasswordValidatorStub,
    generateTokenStub,
    httpHelper,
    userRepositoryStub
  )

  return {
    fakeUser,
    filterUserDataStub,
    forgotPasswordValidatorStub,
    generateTokenStub,
    httpHelper,
    request,
    sut,
    userRepositoryStub
  }
}

describe('forgot Password', () => {
  it('should return forbidden if user is already logged in', async () => {
    expect.hasAssertions()

    const { fakeUser, httpHelper, request, sut } = makeSut()
    request.user = fakeUser

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.forbidden(new MustLogoutError()))
  })

  it('should call validate with correct value', async () => {
    expect.hasAssertions()

    const { forgotPasswordValidatorStub, request, sut } = makeSut()
    const validateSpy = jest.spyOn(forgotPasswordValidatorStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  it('should return badRequest if validation fails', async () => {
    expect.hasAssertions()

    const { forgotPasswordValidatorStub, httpHelper, request, sut } = makeSut()
    jest.spyOn(forgotPasswordValidatorStub, 'validate').mockReturnValueOnce(Promise.resolve(new Error()))

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.badRequest(new Error()))
  })

  it('should call encrypt with correct values', async () => {
    expect.hasAssertions()

    const { fakeUser, generateTokenStub, request, sut } = makeSut()
    const encryptSpy = jest.spyOn(generateTokenStub, 'generate')

    await sut.handle(request)

    expect(encryptSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('should call findByEmail with correct email', async () => {
    expect.hasAssertions()

    const { request, sut, userRepositoryStub } = makeSut()
    const findUserByEmailSpy = jest.spyOn(userRepositoryStub, 'findByEmail')

    await sut.handle(request)

    expect(findUserByEmailSpy).toHaveBeenCalledWith(request.body.email)
  })

  it('should call updateById with correct email', async () => {
    expect.hasAssertions()

    const { fakeUser, request, sut, userRepositoryStub } = makeSut()
    const updateUserSpy = jest.spyOn(userRepositoryStub, 'updateById')

    await sut.handle(request)

    expect(updateUserSpy).toHaveBeenCalledWith(fakeUser.personal.id, {
      'temporary.resetPasswordToken': 'any_token'
    })
  })

  it('should call filterUserData with correct user', async () => {
    expect.hasAssertions()

    const { fakeUser, filterUserDataStub, request, sut } = makeSut()
    const filterSpy = jest.spyOn(filterUserDataStub, 'filter')

    await sut.handle(request)

    expect(filterSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('should return ok with user if succeeds', async () => {
    expect.hasAssertions()

    const { fakeUser, httpHelper, request, sut } = makeSut()

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.ok({ user: makeFakePublicUser(fakeUser) }))
  })
})
