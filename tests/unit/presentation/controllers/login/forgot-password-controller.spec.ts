import { IUser } from '@/domain'

import { FilterUserDataProtocol } from '@/application/protocols/helpers'
import { GenerateTokenProtocol } from '@/application/protocols/providers'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { ValidatorProtocol } from '@/application/protocols/validators'
import { MustLogoutError } from '@/application/usecases/errors'

import { ForgotPasswordController } from '@/presentation/controllers/login'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/helpers/http/protocols'

import { makeHttpHelper } from '@/main/factories/helpers'

import {
  makeFakeUser,
  makeValidatorStub,
  makeGenerateTokenStub,
  makeUserDbRepositoryStub,
  makeFilterUserDataStub,
  makeFakePublicUser
} from '@/tests/__mocks__'

interface SutTypes {
  fakeUser: IUser
  filterUserDataStub: FilterUserDataProtocol
  forgotPasswordValidatorStub: ValidatorProtocol
  generateTokenStub: GenerateTokenProtocol
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  sut: ForgotPasswordController
  userDbRepositoryStub: UserDbRepositoryProtocol
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const filterUserDataStub = makeFilterUserDataStub(fakeUser)
  const forgotPasswordValidatorStub = makeValidatorStub()
  const generateTokenStub = makeGenerateTokenStub()
  const httpHelper = makeHttpHelper()
  const request = { body: { email: fakeUser.personal.email } }
  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)

  const sut = new ForgotPasswordController(
    filterUserDataStub,
    forgotPasswordValidatorStub,
    generateTokenStub,
    httpHelper,
    userDbRepositoryStub
  )

  return {
    fakeUser,
    filterUserDataStub,
    forgotPasswordValidatorStub,
    generateTokenStub,
    httpHelper,
    request,
    sut,
    userDbRepositoryStub
  }
}

describe('forgot Password', () => {
  it('should return forbidden if user is already logged in', async () => {
    expect.hasAssertions()

    const { fakeUser, httpHelper, request, sut } = makeSut()
    request.user = fakeUser

    const response = await sut.handle(request)

    expect(response).toStrictEqual(httpHelper.forbidden(new MustLogoutError()))
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
    jest
      .spyOn(forgotPasswordValidatorStub, 'validate')
      .mockReturnValueOnce(Promise.resolve(new Error()))

    const response = await sut.handle(request)

    expect(response).toStrictEqual(httpHelper.badRequest(new Error()))
  })

  it('should call encrypt with correct values', async () => {
    expect.hasAssertions()

    const { fakeUser, generateTokenStub, request, sut } = makeSut()
    const encryptSpy = jest.spyOn(generateTokenStub, 'generate')

    await sut.handle(request)

    expect(encryptSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('should call findUserByEmail with correct email', async () => {
    expect.hasAssertions()

    const { request, sut, userDbRepositoryStub } = makeSut()
    const findUserByEmailSpy = jest.spyOn(userDbRepositoryStub, 'findUserByEmail')

    await sut.handle(request)

    expect(findUserByEmailSpy).toHaveBeenCalledWith(request.body.email)
  })

  it('should call updateUser with correct email', async () => {
    expect.hasAssertions()

    const { fakeUser, request, sut, userDbRepositoryStub } = makeSut()
    const updateUserSpy = jest.spyOn(userDbRepositoryStub, 'updateUser')

    await sut.handle(request)

    expect(updateUserSpy).toHaveBeenCalledWith(fakeUser, {
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

  it('should return ok with user if succeds', async () => {
    expect.hasAssertions()

    const { fakeUser, httpHelper, request, sut } = makeSut()

    const response = await sut.handle(request)

    expect(response).toStrictEqual(httpHelper.ok({ user: makeFakePublicUser(fakeUser) }))
  })
})
