import { FilterUserDataProtocol } from '@/application/protocols/helpers'
import { MailerServiceProtocol } from '@/application/protocols/mailer'
import { GenerateTokenProtocol } from '@/application/protocols/providers'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { ValidatorProtocol } from '@/application/protocols/validators'
import { ConflictParamError, InvalidParamError, MustLogoutError, MailerServiceError } from '@/application/usecases/errors'
import { IPublicUser, IUser } from '@/domain'
import { makeHttpHelper } from '@/main/factories/helpers'
import { SignUpController } from '@/presentation/controllers/signup'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/helpers/http/protocols'
import { makeFakeUser, makeFakePublicUser, makeFilterUserDataStub, makeGenerateTokenStub, makeUserDbRepositoryStub, makeValidatorStub, makeMailerServiceStub } from '@/tests/__mocks__'

interface SutTypes {
  sut: SignUpController
  userDbRepositoryStub: UserDbRepositoryProtocol
  userValidatorStub: ValidatorProtocol
  fakePublicUser: IPublicUser
  fakeUser: IUser
  filterUserDataStub: FilterUserDataProtocol
  generateAccessTokenStub: GenerateTokenProtocol
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  welcomeEmailStub: MailerServiceProtocol
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const fakePublicUser = makeFakePublicUser(fakeUser)
  const filterUserDataStub = makeFilterUserDataStub(fakeUser)
  const generateAccessTokenStub = makeGenerateTokenStub()
  const httpHelper = makeHttpHelper()
  const request = {
    body: {
      name: fakeUser.personal.name,
      email: fakeUser.personal.email,
      password: fakeUser.personal.password,
      passwordConfirmation: fakeUser.personal.password
    }
  }
  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)
  const userValidatorStub = makeValidatorStub()
  const welcomeEmailStub = makeMailerServiceStub()

  const sut = new SignUpController(
    filterUserDataStub,
    generateAccessTokenStub,
    httpHelper,
    userDbRepositoryStub,
    userValidatorStub,
    welcomeEmailStub
  )

  return {
    sut,
    fakePublicUser,
    fakeUser,
    filterUserDataStub,
    generateAccessTokenStub,
    httpHelper,
    request,
    userDbRepositoryStub,
    userValidatorStub,
    welcomeEmailStub
  }
}

describe('SignUpController', () => {
  it('Should call findUserByEmail with the correct value', async () => {
    const { sut, userDbRepositoryStub, request } = makeSut()
    const findUserByEmailSpy = jest.spyOn(userDbRepositoryStub, 'findUserByEmail')

    await sut.handle(request)

    expect(findUserByEmailSpy).toHaveBeenCalledWith(request.body.email)
  })

  it('Should return conflict if email exists', async () => {
    const { sut, userDbRepositoryStub, fakeUser, httpHelper, request } = makeSut()
    const error = new ConflictParamError('email')
    jest
      .spyOn(userDbRepositoryStub, 'findUserByEmail')
      .mockReturnValueOnce(Promise.resolve(fakeUser))

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.conflict(error))
  })

  it('Should call the saveUser with correct values', async () => {
    const { sut, userDbRepositoryStub, request } = makeSut()
    const saveUserSpy = jest.spyOn(userDbRepositoryStub, 'saveUser')
    jest
      .spyOn(userDbRepositoryStub, 'findUserByEmail')
      .mockReturnValueOnce(Promise.resolve(undefined))

    await sut.handle(request)

    expect(saveUserSpy).toHaveBeenCalledWith(request.body)
  })

  it('Should call generate with the correct user', async () => {
    const { sut, fakeUser, generateAccessTokenStub, request, userDbRepositoryStub } = makeSut()

    jest
      .spyOn(userDbRepositoryStub, 'findUserByEmail')
      .mockReturnValueOnce(Promise.resolve(undefined))

    const generateSpy = jest.spyOn(generateAccessTokenStub, 'generate')

    await sut.handle(request)

    expect(generateSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('Should call validate with correct values', async () => {
    const { sut, userDbRepositoryStub, userValidatorStub, request } = makeSut()
    const validateSpy = jest.spyOn(userValidatorStub, 'validate')
    jest
      .spyOn(userDbRepositoryStub, 'findUserByEmail')
      .mockReturnValueOnce(Promise.resolve(undefined))

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  it('Should call badRequest with the correct value', async () => {
    const { sut, userDbRepositoryStub, userValidatorStub, httpHelper, request } = makeSut()

    const error = new Error('any_error')
    jest.spyOn(userValidatorStub, 'validate').mockReturnValueOnce(error)

    const badRequestSpy = jest.spyOn(httpHelper, 'badRequest')

    jest
      .spyOn(userDbRepositoryStub, 'findUserByEmail')
      .mockReturnValueOnce(Promise.resolve(undefined))

    await sut.handle(request)

    expect(badRequestSpy).toHaveBeenCalledWith(error)
  })

  it('Should return badRequest if validation fails with an error message', async () => {
    const { sut, userDbRepositoryStub, userValidatorStub, httpHelper, request } = makeSut()
    const error = new InvalidParamError('any_field')
    jest.spyOn(userValidatorStub, 'validate').mockReturnValueOnce(error)
    jest
      .spyOn(userDbRepositoryStub, 'findUserByEmail')
      .mockReturnValueOnce(Promise.resolve(undefined))

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.badRequest(error))
  })

  it('Should return badRequest if user is already logged in', async () => {
    const { sut, fakeUser, httpHelper, request } = makeSut()
    request.user = fakeUser

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.badRequest(new MustLogoutError()))
  })

  it('Should return serverError if mailer service throws', async () => {
    const { sut, httpHelper, request, userDbRepositoryStub, welcomeEmailStub } = makeSut()
    const error = new MailerServiceError()
    jest
      .spyOn(userDbRepositoryStub, 'findUserByEmail')
      .mockReturnValueOnce(Promise.resolve(undefined))

    jest.spyOn(welcomeEmailStub, 'send').mockReturnValueOnce(Promise.resolve(error))

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.serverError(error))
  })

  it('Should call send with the correct user', async () => {
    const { sut, fakeUser, userDbRepositoryStub, request, welcomeEmailStub } = makeSut()
    const sendSpy = jest.spyOn(welcomeEmailStub, 'send')
    jest
      .spyOn(userDbRepositoryStub, 'findUserByEmail')
      .mockReturnValueOnce(Promise.resolve(undefined))

    await sut.handle(request)

    expect(sendSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('Should call ok with the correct value', async () => {
    const { sut, userDbRepositoryStub, fakePublicUser, httpHelper, request } = makeSut()
    const okSpy = jest.spyOn(httpHelper, 'ok')
    jest
      .spyOn(userDbRepositoryStub, 'findUserByEmail')
      .mockReturnValueOnce(Promise.resolve(undefined))

    await sut.handle(request)

    expect(okSpy).toHaveBeenCalledWith({ user: fakePublicUser, accessToken: 'any_token' })
  })

  it('Should return ok if validation succeds', async () => {
    const { sut, fakePublicUser, httpHelper, request, userDbRepositoryStub } = makeSut()
    jest
      .spyOn(userDbRepositoryStub, 'findUserByEmail')
      .mockReturnValueOnce(Promise.resolve(undefined))

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.ok({ user: fakePublicUser, accessToken: 'any_token' }))
  })
})