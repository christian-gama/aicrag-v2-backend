import { IPublicUser, IUser } from '@/domain/user/index'
import { FilterUserDataProtocol } from '@/application/protocols/helpers/filter-user-data/filter-user-data-protocol'
import { GenerateTokenProtocol } from '@/application/protocols/providers/generate-token-protocol'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/helpers/http/protocols'
import { MailerServiceProtocol } from '@/application/protocols/services/mailer/mailer-service-protocol'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories/user/user-db-repository-protocol'
import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { SignUpController } from '@/presentation/controllers/authentication/signup/signup-controller'
import { makeHttpHelper } from '@/main/factories/helpers/http-helper-factory'
import { makeFakePublicUser } from '@/tests/__mocks__/domain/mock-public-user'
import { makeFakeUser } from '@/tests/__mocks__/domain/mock-user'
import { makeFilterUserDataStub } from '@/tests/__mocks__/application/helpers/mock-filter-user-data'
import { makeGenerateTokenStub } from '@/tests/__mocks__/infra/providers/mock-generate-token'
import { makeMailerServiceStub } from '@/tests/__mocks__/main/services/mailer/mock-mailer-service'
import { makeUserDbRepositoryStub } from '@/tests/__mocks__/infra/database/mongodb/user/mock-user-db-repository'
import { makeValidatorStub } from '@/tests/__mocks__/application/validators/mock-validator'
export interface SutTypes {
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

export const makeSut = (): SutTypes => {
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
