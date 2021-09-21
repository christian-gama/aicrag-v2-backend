import { IUser } from '@/domain/user'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/helpers/http/protocols'
import { ForgotPasswordController } from '@/presentation/controllers/authentication/forgot-password/forgot-password-controller'
import { makeHttpHelper } from '@/main/factories/helpers/http-helper-factory'
import { makeFakeUser } from '@/tests/__mocks__/domain/mock-user'
import { makeValidatorStub } from '@/tests/__mocks__/application/validators/mock-validator'
import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { makeJwtAdapterStub } from '@/tests/__mocks__/infra/adapters/cryptography/mock-jwt-adapter'
import { EncrypterProtocol } from '@/application/protocols/cryptography/encrypter-protocol'
import { UserDbRepositoryProtocol } from '@/infra/database/mongodb/user'
import { makeUserDbRepositoryStub } from '@/tests/__mocks__/infra/database/mongodb/user/mock-user-db-repository'

interface SutTypes {
  sut: ForgotPasswordController
  fakeUser: IUser
  forgotPasswordValidatorStub: ValidatorProtocol
  httpHelper: HttpHelperProtocol
  jwtAccessTokenStub: EncrypterProtocol
  request: HttpRequest
  userDbRepositoryStub: UserDbRepositoryProtocol
}

export const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const forgotPasswordValidatorStub = makeValidatorStub()
  const httpHelper = makeHttpHelper()
  const jwtAccessTokenStub = makeJwtAdapterStub()
  const request = { body: { email: fakeUser.personal.email } }
  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)

  const sut = new ForgotPasswordController(forgotPasswordValidatorStub, httpHelper, jwtAccessTokenStub, userDbRepositoryStub)

  return { sut, fakeUser, forgotPasswordValidatorStub, httpHelper, jwtAccessTokenStub, request, userDbRepositoryStub }
}
