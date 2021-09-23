import { IUser } from '@/domain'
import { MailerServiceProtocol } from '@/application/protocols/services/mailer/mailer-service-protocol'
import { UserDbRepositoryProtocol } from '@/infra/database/mongodb/user'
import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { ForgotPasswordController } from '@/presentation/controllers/authentication/forgot-password/forgot-password-controller'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/helpers/http/protocols'
import { makeHttpHelper } from '@/main/factories/helpers/http-helper-factory'
import { makeFakeUser } from '@/tests/__mocks__/domain/mock-user'
import { makeValidatorStub } from '@/tests/__mocks__/application/validators/mock-validator'
import { makeUserDbRepositoryStub } from '@/tests/__mocks__/infra/database/mongodb/user/mock-user-db-repository'
import { makeMailerServiceStub } from '@/tests/__mocks__/main/services/mailer/mock-mailer-service'
import { makeGenerateTokenStub } from '@/tests/__mocks__/infra/providers/mock-generate-token'
import { GenerateTokenProtocol } from '@/application/protocols/providers/generate-token-protocol'

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

export const makeSut = (): SutTypes => {
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
