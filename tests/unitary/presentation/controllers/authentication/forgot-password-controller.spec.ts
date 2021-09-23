import { MailerServiceProtocol } from '@/application/protocols/mailer'
import { GenerateTokenProtocol } from '@/application/protocols/providers'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { ValidatorProtocol } from '@/application/protocols/validators'
import { IUser } from '@/domain'
import { makeHttpHelper } from '@/main/factories/helpers/http-helper-factory'
import { ForgotPasswordController } from '@/presentation/controllers/authentication/forgot-password/forgot-password-controller'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/helpers/http/protocols'
import { makeFakeUser, makeMailerServiceStub, makeValidatorStub, makeGenerateTokenStub, makeUserDbRepositoryStub } from '@/tests/__mocks__'

interface SutTypes {
  sut: ForgotPasswordController
  fakeUser: IUser
  forgotPasswordValidatorStub: ValidatorProtocol
  forgotPasswordEmailStub: MailerServiceProtocol
  httpHelper: HttpHelperProtocol
  generateTokenStub: GenerateTokenProtocol
  request: HttpRequest
  userDbRepositoryStub: UserDbRepositoryProtocol
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const forgotPasswordEmailStub = makeMailerServiceStub()
  const forgotPasswordValidatorStub = makeValidatorStub()
  const httpHelper = makeHttpHelper()
  const generateTokenStub = makeGenerateTokenStub()
  const request = { body: { email: fakeUser.personal.email } }
  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)

  const sut = new ForgotPasswordController(forgotPasswordEmailStub, forgotPasswordValidatorStub, httpHelper, generateTokenStub, userDbRepositoryStub)

  return { sut, fakeUser, forgotPasswordEmailStub, forgotPasswordValidatorStub, httpHelper, generateTokenStub, request, userDbRepositoryStub }
}

describe('Forgot Password', () => {
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
    const { sut, userDbRepositoryStub, request } = makeSut()
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

  it('Should call send with correct email', async () => {
    const { sut, fakeUser, forgotPasswordEmailStub, request } = makeSut()
    const sendSpy = jest.spyOn(forgotPasswordEmailStub, 'send')

    await sut.handle(request)

    expect(sendSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('Should call ok with correct message', async () => {
    const { sut, fakeUser, httpHelper, request } = makeSut()
    const okSpy = jest.spyOn(httpHelper, 'ok')

    await sut.handle(request)

    expect(okSpy).toHaveBeenCalledWith({
      message: `Instructions to reset your password were sent to ${fakeUser.personal.email}`
    })
  })
})
