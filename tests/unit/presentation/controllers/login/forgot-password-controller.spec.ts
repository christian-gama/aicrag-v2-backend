import { IUser } from '@/domain'

import { FilterUserDataProtocol } from '@/application/protocols/helpers'
import { GenerateTokenProtocol } from '@/application/protocols/providers'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { ValidatorProtocol } from '@/application/protocols/validators'
import { MustLogoutError } from '@/application/usecases/errors'

import { ForgotPasswordController } from '@/presentation/controllers/account'
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
  sut: ForgotPasswordController
  fakeUser: IUser
  filterUserDataStub: FilterUserDataProtocol
  forgotPasswordValidatorStub: ValidatorProtocol
  generateTokenStub: GenerateTokenProtocol
  httpHelper: HttpHelperProtocol
  request: HttpRequest
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
    sut,
    fakeUser,
    filterUserDataStub,
    forgotPasswordValidatorStub,
    generateTokenStub,
    httpHelper,
    request,
    userDbRepositoryStub
  }
}

describe('Forgot Password', () => {
  it('Should return forbidden if user is already logged in', async () => {
    const { sut, fakeUser, httpHelper, request } = makeSut()
    request.user = fakeUser

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.forbidden(new MustLogoutError()))
  })

  it('Should call validate with correct value', async () => {
    const { sut, forgotPasswordValidatorStub, request } = makeSut()
    const validateSpy = jest.spyOn(forgotPasswordValidatorStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  it('Should return badRequest if validation fails', async () => {
    const { sut, forgotPasswordValidatorStub, httpHelper, request } = makeSut()
    jest
      .spyOn(forgotPasswordValidatorStub, 'validate')
      .mockReturnValueOnce(Promise.resolve(new Error()))

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.badRequest(new Error()))
  })

  it('Should call encrypt with correct values', async () => {
    const { sut, fakeUser, generateTokenStub, request } = makeSut()
    const encryptSpy = jest.spyOn(generateTokenStub, 'generate')

    await sut.handle(request)

    expect(encryptSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('Should call findUserByEmail with correct email', async () => {
    const { sut, request, userDbRepositoryStub } = makeSut()
    const findUserByEmailSpy = jest.spyOn(userDbRepositoryStub, 'findUserByEmail')

    await sut.handle(request)

    expect(findUserByEmailSpy).toHaveBeenCalledWith(request.body.email)
  })

  it('Should call updateUser with correct email', async () => {
    const { sut, fakeUser, userDbRepositoryStub, request } = makeSut()
    const updateUserSpy = jest.spyOn(userDbRepositoryStub, 'updateUser')

    await sut.handle(request)

    expect(updateUserSpy).toHaveBeenCalledWith(fakeUser, {
      'temporary.resetPasswordToken': 'any_token'
    })
  })

  it('Should call filterUserData with correct user', async () => {
    const { sut, fakeUser, filterUserDataStub, request } = makeSut()
    const filterSpy = jest.spyOn(filterUserDataStub, 'filter')

    await sut.handle(request)

    expect(filterSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('Should call ok with correct message', async () => {
    const { sut, fakeUser, httpHelper, request } = makeSut()
    const okSpy = jest.spyOn(httpHelper, 'ok')

    await sut.handle(request)

    expect(okSpy).toHaveBeenCalledWith({ user: makeFakePublicUser(fakeUser) })
  })
})
