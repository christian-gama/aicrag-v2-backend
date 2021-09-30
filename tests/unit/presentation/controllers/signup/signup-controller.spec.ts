import { IPublicUser, IUser } from '@/domain'

import { FilterUserDataProtocol } from '@/application/protocols/helpers'
import { GenerateTokenProtocol } from '@/application/protocols/providers'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { ValidatorProtocol } from '@/application/protocols/validators'
import {
  ConflictParamError,
  InvalidParamError,
  MustLogoutError
} from '@/application/usecases/errors'

import { SignUpController } from '@/presentation/controllers/signup'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/helpers/http/protocols'

import { makeHttpHelper } from '@/main/factories/helpers'

import {
  makeFakeUser,
  makeFakePublicUser,
  makeFilterUserDataStub,
  makeGenerateTokenStub,
  makeUserDbRepositoryStub,
  makeValidatorStub
} from '@/tests/__mocks__'

interface SutTypes {
  fakePublicUser: IPublicUser
  fakeUser: IUser
  filterUserDataStub: FilterUserDataProtocol
  generateAccessTokenStub: GenerateTokenProtocol
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  sut: SignUpController
  userDbRepositoryStub: UserDbRepositoryProtocol
  userValidatorStub: ValidatorProtocol
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const fakePublicUser = makeFakePublicUser(fakeUser)
  const filterUserDataStub = makeFilterUserDataStub(fakeUser)
  const generateAccessTokenStub = makeGenerateTokenStub()
  const httpHelper = makeHttpHelper()
  const request = {
    body: {
      email: fakeUser.personal.email,
      name: fakeUser.personal.name,
      password: fakeUser.personal.password,
      passwordConfirmation: fakeUser.personal.password
    }
  }
  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)
  const userValidatorStub = makeValidatorStub()

  const sut = new SignUpController(
    filterUserDataStub,
    generateAccessTokenStub,
    httpHelper,
    userDbRepositoryStub,
    userValidatorStub
  )

  return {
    fakePublicUser,
    fakeUser,
    filterUserDataStub,
    generateAccessTokenStub,
    httpHelper,
    request,
    sut,
    userDbRepositoryStub,
    userValidatorStub
  }
}

describe('signUpController', () => {
  it('should return forbidden if user is already logged in', async () => {
    expect.hasAssertions()

    const { fakeUser, httpHelper, request, sut } = makeSut()
    request.user = fakeUser

    const response = await sut.handle(request)

    expect(response).toStrictEqual(httpHelper.forbidden(new MustLogoutError()))
  })

  it('should call findUserByEmail with the correct value', async () => {
    expect.hasAssertions()

    const { request, sut, userDbRepositoryStub } = makeSut()
    const findUserByEmailSpy = jest.spyOn(userDbRepositoryStub, 'findUserByEmail')

    await sut.handle(request)

    expect(findUserByEmailSpy).toHaveBeenCalledWith(request.body.email)
  })

  it('should return conflict if email exists', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut } = makeSut()
    const error = new ConflictParamError('email')

    const response = await sut.handle(request)

    expect(response).toStrictEqual(httpHelper.conflict(error))
  })

  it('should call the saveUser with correct values', async () => {
    expect.hasAssertions()

    const { request, sut, userDbRepositoryStub } = makeSut()
    const saveUserSpy = jest.spyOn(userDbRepositoryStub, 'saveUser')
    jest
      .spyOn(userDbRepositoryStub, 'findUserByEmail')
      .mockReturnValueOnce(Promise.resolve(undefined))

    await sut.handle(request)

    expect(saveUserSpy).toHaveBeenCalledWith(request.body)
  })

  it('should call generate with the correct user', async () => {
    expect.hasAssertions()

    const { fakeUser, generateAccessTokenStub, request, sut, userDbRepositoryStub } = makeSut()
    const generateSpy = jest.spyOn(generateAccessTokenStub, 'generate')
    jest
      .spyOn(userDbRepositoryStub, 'findUserByEmail')
      .mockReturnValueOnce(Promise.resolve(undefined))

    await sut.handle(request)

    expect(generateSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('should call validate with correct values', async () => {
    expect.hasAssertions()

    const { request, sut, userDbRepositoryStub, userValidatorStub } = makeSut()
    const validateSpy = jest.spyOn(userValidatorStub, 'validate')
    jest
      .spyOn(userDbRepositoryStub, 'findUserByEmail')
      .mockReturnValueOnce(Promise.resolve(undefined))

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  it('should call badRequest with the correct value', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut, userDbRepositoryStub, userValidatorStub } = makeSut()
    const badRequestSpy = jest.spyOn(httpHelper, 'badRequest')
    const error = new Error('any_error')
    jest
      .spyOn(userDbRepositoryStub, 'findUserByEmail')
      .mockReturnValueOnce(Promise.resolve(undefined))
    jest.spyOn(userValidatorStub, 'validate').mockReturnValueOnce(error)

    await sut.handle(request)

    expect(badRequestSpy).toHaveBeenCalledWith(error)
  })

  it('should return badRequest if validation fails with an error message', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut, userDbRepositoryStub, userValidatorStub } = makeSut()
    const error = new InvalidParamError('any_field')
    jest
      .spyOn(userDbRepositoryStub, 'findUserByEmail')
      .mockReturnValueOnce(Promise.resolve(undefined))
    jest.spyOn(userValidatorStub, 'validate').mockReturnValueOnce(error)

    const response = await sut.handle(request)

    expect(response).toStrictEqual(httpHelper.badRequest(error))
  })

  it('should call ok with the correct value', async () => {
    expect.hasAssertions()

    const { fakePublicUser, httpHelper, request, sut, userDbRepositoryStub } = makeSut()
    const okSpy = jest.spyOn(httpHelper, 'ok')
    jest
      .spyOn(userDbRepositoryStub, 'findUserByEmail')
      .mockReturnValueOnce(Promise.resolve(undefined))

    await sut.handle(request)

    expect(okSpy).toHaveBeenCalledWith({ accessToken: 'any_token', user: fakePublicUser })
  })

  it('should return ok if validation succeds', async () => {
    expect.hasAssertions()

    const { fakePublicUser, httpHelper, request, sut, userDbRepositoryStub } = makeSut()
    jest
      .spyOn(userDbRepositoryStub, 'findUserByEmail')
      .mockReturnValueOnce(Promise.resolve(undefined))

    const response = await sut.handle(request)

    expect(response).toStrictEqual(
      httpHelper.ok({ accessToken: 'any_token', user: fakePublicUser })
    )
  })
})
