import { HasherProtocol } from '@/application/protocols/cryptography'
import { FilterUserDataProtocol } from '@/application/protocols/helpers'
import { GenerateTokenProtocol, VerifyTokenProtocol } from '@/application/protocols/providers'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { ValidatorProtocol } from '@/application/protocols/validators'
import { MustLogoutError, InvalidTokenError } from '@/application/usecases/errors'
import { IUser, IPublicUser } from '@/domain'
import { makeHttpHelper } from '@/main/factories/helpers'
import { ResetPasswordController } from '@/presentation/controllers/login/reset-password-controller'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/helpers/http/protocols'
import { makeFakeUser, makeFilterUserDataStub, makeFakePublicUser, makeGenerateTokenStub, makeHasherStub, makeValidatorStub, makeUserDbRepositoryStub, makeVerifyTokenStub } from '@/tests/__mocks__'

interface SutTypes {
  sut: ResetPasswordController
  fakeUser: IUser
  filteredUser: IPublicUser
  filterUserDataStub: FilterUserDataProtocol
  generateRefreshTokenStub: GenerateTokenProtocol
  hasherStub: HasherProtocol
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  resetPasswordValidatorStub: ValidatorProtocol
  userDbRepositoryStub: UserDbRepositoryProtocol
  verifyResetPasswordTokenStub: VerifyTokenProtocol
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const filterUserDataStub = makeFilterUserDataStub(fakeUser)
  const filteredUser = makeFakePublicUser(fakeUser)
  const generateRefreshTokenStub = makeGenerateTokenStub()
  const hasherStub = makeHasherStub()
  const httpHelper = makeHttpHelper()
  const request = {
    accessToken: 'any_token',
    body: { password: 'new_password', passwordConfirmation: 'new_password' }
  }
  const resetPasswordValidatorStub = makeValidatorStub()
  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)
  const verifyResetPasswordTokenStub = makeVerifyTokenStub()

  const sut = new ResetPasswordController(
    filterUserDataStub,
    generateRefreshTokenStub,
    hasherStub,
    httpHelper,
    resetPasswordValidatorStub,
    userDbRepositoryStub,
    verifyResetPasswordTokenStub
  )

  return {
    sut,
    fakeUser,
    filteredUser,
    filterUserDataStub,
    generateRefreshTokenStub,
    hasherStub,
    httpHelper,
    request,
    resetPasswordValidatorStub,
    userDbRepositoryStub,
    verifyResetPasswordTokenStub
  }
}

describe('ResetPasswordController', () => {
  it('Should return forbidden if user is logged in', async () => {
    const { sut, fakeUser, httpHelper, request } = makeSut()
    request.user = fakeUser

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.forbidden(new MustLogoutError()))
  })

  it('Should call verify with correct token', async () => {
    const { sut, request, verifyResetPasswordTokenStub } = makeSut()
    const verifyStub = jest.spyOn(verifyResetPasswordTokenStub, 'verify')

    await sut.handle(request)

    expect(verifyStub).toHaveBeenCalledWith(request.accessToken)
  })

  it('Should return unauthorized if verify fails', async () => {
    const { sut, httpHelper, request, verifyResetPasswordTokenStub } = makeSut()
    jest
      .spyOn(verifyResetPasswordTokenStub, 'verify')
      .mockReturnValueOnce(Promise.resolve(new InvalidTokenError()))

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.unauthorized(new InvalidTokenError()))
  })

  it('Should call updateUser with correct values', async () => {
    const { sut, fakeUser, request, userDbRepositoryStub, verifyResetPasswordTokenStub } = makeSut()

    jest
      .spyOn(verifyResetPasswordTokenStub, 'verify')
      .mockReturnValueOnce(Promise.resolve(fakeUser))

    const updateUserSpy = jest.spyOn(userDbRepositoryStub, 'updateUser')

    await sut.handle(request)

    expect(updateUserSpy).toHaveBeenCalledWith(fakeUser, {
      'personal.password': 'hashed_value'
    })
  })

  it('Should call validate with correct credentials', async () => {
    const { sut, request, resetPasswordValidatorStub } = makeSut()
    const validateSpy = jest.spyOn(resetPasswordValidatorStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  it('Should return badRequest if validation fails', async () => {
    const { sut, httpHelper, request, resetPasswordValidatorStub } = makeSut()
    jest
      .spyOn(resetPasswordValidatorStub, 'validate')
      .mockReturnValueOnce(Promise.resolve(new Error()))

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.badRequest(new Error()))
  })

  it('Should call hash with correct password', async () => {
    const { sut, hasherStub, request } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')

    await sut.handle(request)

    expect(hashSpy).toHaveBeenCalledWith(request.body.password)
  })

  it('Should call generate with correct user', async () => {
    const { sut, fakeUser, generateRefreshTokenStub, request, verifyResetPasswordTokenStub } =
      makeSut()
    jest
      .spyOn(verifyResetPasswordTokenStub, 'verify')
      .mockReturnValueOnce(Promise.resolve(fakeUser))

    const generateSpy = jest.spyOn(generateRefreshTokenStub, 'generate')

    await sut.handle(request)

    expect(generateSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('Should call filter with correct user', async () => {
    const { sut, fakeUser, filterUserDataStub, request, verifyResetPasswordTokenStub } = makeSut()
    jest
      .spyOn(verifyResetPasswordTokenStub, 'verify')
      .mockReturnValueOnce(Promise.resolve(fakeUser))

    const filterSpy = jest.spyOn(filterUserDataStub, 'filter')

    await sut.handle(request)

    expect(filterSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('Should return ok if succeds', async () => {
    const {
      sut,
      fakeUser,
      filteredUser,
      filterUserDataStub,
      httpHelper,
      request,
      verifyResetPasswordTokenStub
    } = makeSut()
    jest
      .spyOn(verifyResetPasswordTokenStub, 'verify')
      .mockReturnValueOnce(Promise.resolve(fakeUser))

    jest.spyOn(filterUserDataStub, 'filter').mockReturnValueOnce(filteredUser)

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.ok({ user: filteredUser, refreshToken: 'any_token' }))
  })
})
