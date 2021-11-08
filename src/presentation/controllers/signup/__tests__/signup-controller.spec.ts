import { IPublicUser, IUser } from '@/domain'
import { IFilterUserData } from '@/domain/helpers'
import { IGenerateToken } from '@/domain/providers'
import { IUserRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'
import { ConflictParamError, InvalidParamError, MustLogoutError } from '@/application/errors'
import { SignUpController } from '@/presentation/controllers/signup'
import { IHttpHelper, HttpRequest } from '@/presentation/http/protocols'
import { makeHttpHelper } from '@/main/factories/helpers'
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
  filterUserDataStub: IFilterUserData
  generateAccessTokenStub: IGenerateToken
  httpHelper: IHttpHelper
  request: HttpRequest
  sut: SignUpController
  userRepositoryStub: IUserRepository
  userValidatorStub: IValidator
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
    const { fakeUser, httpHelper, request, sut } = makeSut()
    request.user = fakeUser

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.forbidden(new MustLogoutError()))
  })

  it('should call findByEmail with the correct value', async () => {
    const { request, sut, userRepositoryStub } = makeSut()
    const findUserByEmailSpy = jest.spyOn(userRepositoryStub, 'findByEmail')

    await sut.handle(request)

    expect(findUserByEmailSpy).toHaveBeenCalledWith(request.body.email)
  })

  it('should return conflict if email exists', async () => {
    const { httpHelper, request, sut } = makeSut()
    const error = new ConflictParamError('email')

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.conflict(error))
  })

  it('should call the save with correct values', async () => {
    const { request, sut, userRepositoryStub } = makeSut()
    const saveUserSpy = jest.spyOn(userRepositoryStub, 'save')
    jest.spyOn(userRepositoryStub, 'findByEmail').mockReturnValueOnce(Promise.resolve(null))

    await sut.handle(request)

    expect(saveUserSpy).toHaveBeenCalledWith(request.body)
  })

  it('should call generate with the correct user', async () => {
    const { fakeUser, generateAccessTokenStub, request, sut, userRepositoryStub } = makeSut()
    const generateSpy = jest.spyOn(generateAccessTokenStub, 'generate')
    jest.spyOn(userRepositoryStub, 'findByEmail').mockReturnValueOnce(Promise.resolve(null))

    await sut.handle(request)

    expect(generateSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('should call validate with correct values', async () => {
    const { request, sut, userRepositoryStub, userValidatorStub } = makeSut()
    const validateSpy = jest.spyOn(userValidatorStub, 'validate')
    jest.spyOn(userRepositoryStub, 'findByEmail').mockReturnValueOnce(Promise.resolve(null))

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  it('should call badRequest with the correct value', async () => {
    const { httpHelper, request, sut, userRepositoryStub, userValidatorStub } = makeSut()
    const badRequestSpy = jest.spyOn(httpHelper, 'badRequest')
    const error = new Error('any_error')
    jest.spyOn(userRepositoryStub, 'findByEmail').mockReturnValueOnce(Promise.resolve(null))
    jest.spyOn(userValidatorStub, 'validate').mockReturnValueOnce(error)

    await sut.handle(request)

    expect(badRequestSpy).toHaveBeenCalledWith(error)
  })

  it('should return badRequest if validation fails with an error message', async () => {
    const { httpHelper, request, sut, userRepositoryStub, userValidatorStub } = makeSut()
    const error = new InvalidParamError('any_field')
    jest.spyOn(userRepositoryStub, 'findByEmail').mockReturnValueOnce(Promise.resolve(null))
    jest.spyOn(userValidatorStub, 'validate').mockReturnValueOnce(error)

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.badRequest(error))
  })

  it('should call ok with the correct value', async () => {
    const { fakePublicUser, httpHelper, request, sut, userRepositoryStub } = makeSut()
    const okSpy = jest.spyOn(httpHelper, 'ok')
    jest.spyOn(userRepositoryStub, 'findByEmail').mockReturnValueOnce(Promise.resolve(null))

    await sut.handle(request)

    expect(okSpy).toHaveBeenCalledWith({ accessToken: 'any_token', user: fakePublicUser })
  })

  it('should return ok if validation succeeds', async () => {
    const { fakePublicUser, httpHelper, request, sut, userRepositoryStub } = makeSut()
    jest.spyOn(userRepositoryStub, 'findByEmail').mockReturnValueOnce(Promise.resolve(null))

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.ok({ accessToken: 'any_token', user: fakePublicUser }))
  })
})
