import { PublicUser, User } from '@/domain/user'
import { AccountDbRepositoryProtocol } from '@/application/protocols/repositories/account/account-db-repository-protocol'
import { EncrypterProtocol } from '@/application/protocols/cryptography/encrypter-protocol'
import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { ActivateAccountController } from '@/presentation/controllers/authentication/activate-account/activate-account-controller'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/helpers/http/protocols'
import { makeHttpHelper } from '@/main/factories/helpers/http-helper-factory'
import { FilterUserDataProtocol } from '@/application/usecases/helpers/filter-user-data'
import { makeAccountDbRepositoryStub } from '@/tests/__mocks__/infra/database/mongodb/account/mock-account-db-repository'
import { makeEncrypterStub } from '@/tests/__mocks__/infra/adapters/cryptography/mock-jwt-adapter'
import { makeFakePublicUser } from '@/tests/__mocks__/domain/mock-public-user'
import { makeFakeUser } from '@/tests/__mocks__/domain/mock-user'
import { makeFilterUserDataStub } from '@/tests/__mocks__/application/helpers/mock-filter-user-data'
import { makeValidatorStub } from '@/tests/__mocks__/application/validators/mock-validator'

export interface SutTypes {
  sut: ActivateAccountController
  accountDbRepositoryStub: AccountDbRepositoryProtocol
  activateAccountValidatorStub: ValidatorProtocol
  fakePublicUser: PublicUser
  fakeUser: User
  filterUserDataStub: FilterUserDataProtocol
  httpHelper: HttpHelperProtocol
  encrypterStub: EncrypterProtocol
  request: HttpRequest
}

export const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const fakePublicUser = makeFakePublicUser(fakeUser)
  const accountDbRepositoryStub = makeAccountDbRepositoryStub(fakeUser)
  const activateAccountValidatorStub = makeValidatorStub()
  const filterUserDataStub = makeFilterUserDataStub(fakeUser)
  const httpHelper = makeHttpHelper()
  const encrypterStub = makeEncrypterStub()
  const request = {
    body: {
      email: fakeUser.personal.email,
      activationCode: fakeUser.temporary.activationCode
    }
  }
  const sut = new ActivateAccountController(
    accountDbRepositoryStub,
    activateAccountValidatorStub,
    filterUserDataStub,
    httpHelper,
    encrypterStub
  )

  return {
    sut,
    accountDbRepositoryStub,
    activateAccountValidatorStub,
    fakePublicUser,
    fakeUser,
    filterUserDataStub,
    httpHelper,
    encrypterStub,
    request
  }
}
