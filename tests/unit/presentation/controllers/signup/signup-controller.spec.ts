import { IPublicUser, IUser } from '@/domain'
import { FilterUserDataProtocol } from '@/domain/helpers'
import { GenerateTokenProtocol } from '@/domain/providers'
import { UserRepositoryProtocol } from '@/domain/repositories'
import { ValidatorProtocol } from '@/domain/validators'

import { ConflictParamError, InvalidParamError, MustLogoutError } from '@/application/errors'

import { SignUpController } from '@/presentation/controllers/signup'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/http/protocols'

import { makeHttpHelper } from '@/factories/helpers'

import {
  makeFakeUser,
  makeFakePublicUser,
  makeFilterUserDataStub,
  makeGenerateTokenStub,
  makeUserRepositoryStub,
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
  userRepositoryStub: UserRepositoryProtocol
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
  const userRepositoryStub = makeUserRepositoryStub(fakeUser)
  const userValidatorStub = makeValidatorStub()

  const sut = new SignUpController(
    filterUserDataStub,
    generateAccessTokenStub,
    httpHelper,
    userRepositoryStub,
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
    userRepositoryStub,
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

    const { request, sut, userRepositoryStub } = makeSut()
    const findUserByEmailSpy = jest.spyOn(userRepositoryStub, 'findUserByEmail')

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

    const { request, sut, userRepositoryStub } = makeSut()
    const saveUserSpy = jest.spyOn(userRepositoryStub, 'saveUser')
    jest
      .spyOn(userRepositoryStub, 'findUserByEmail')
      .mockReturnValueOnce(Promise.resolve(null))

    await sut.handle(request)

    expect(saveUserSpy).toHaveBeenCalledWith(request.body)
  })

  it('should call generate with the correct user', async () => {
    expect.hasAssertions()

    const { fakeUser, generateAccessTokenStub, request, sut, userRepositoryStub } = makeSut()
    const generateSpy = jest.spyOn(generateAccessTokenStub, 'generate')
    jest
      .spyOn(userRepositoryStub, 'findUserByEmail')
      .mockReturnValueOnce(Promise.resolve(null))

    await sut.handle(request)

    expect(generateSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('should call validate with correct values', async () => {
    expect.hasAssertions()

    const { request, sut, userRepositoryStub, userValidatorStub } = makeSut()
    const validateSpy = jest.spyOn(userValidatorStub, 'validate')
    jest
      .spyOn(userRepositoryStub, 'findUserByEmail')
      .mockReturnValueOnce(Promise.resolve(null))

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  it('should call badRequest with the correct value', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut, userRepositoryStub, userValidatorStub } = makeSut()
    const badRequestSpy = jest.spyOn(httpHelper, 'badRequest')
    const error = new Error('any_error')
    jest
      .spyOn(userRepositoryStub, 'findUserByEmail')
      .mockReturnValueOnce(Promise.resolve(null))
    jest.spyOn(userValidatorStub, 'validate').mockReturnValueOnce(error)

    await sut.handle(request)

    expect(badRequestSpy).toHaveBeenCalledWith(error)
  })

  it('should return badRequest if validation fails with an error message', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut, userRepositoryStub, userValidatorStub } = makeSut()
    const error = new InvalidParamError('any_field')
    jest
      .spyOn(userRepositoryStub, 'findUserByEmail')
      .mockReturnValueOnce(Promise.resolve(null))
    jest.spyOn(userValidatorStub, 'validate').mockReturnValueOnce(error)

    const response = await sut.handle(request)

    expect(response).toStrictEqual(httpHelper.badRequest(error))
  })

  it('should call ok with the correct value', async () => {
    expect.hasAssertions()

    const { fakePublicUser, httpHelper, request, sut, userRepositoryStub } = makeSut()
    const okSpy = jest.spyOn(httpHelper, 'ok')
    jest
      .spyOn(userRepositoryStub, 'findUserByEmail')
      .mockReturnValueOnce(Promise.resolve(null))

    await sut.handle(request)

    expect(okSpy).toHaveBeenCalledWith({ accessToken: 'any_token', user: fakePublicUser })
  })

  it('should return ok if validation succeeds', async () => {
    expect.hasAssertions()

    const { fakePublicUser, httpHelper, request, sut, userRepositoryStub } = makeSut()
    jest
      .spyOn(userRepositoryStub, 'findUserByEmail')
      .mockReturnValueOnce(Promise.resolve(null))

    const response = await sut.handle(request)

    expect(response).toStrictEqual(
      httpHelper.ok({ accessToken: 'any_token', user: fakePublicUser })
    )
  })
})
