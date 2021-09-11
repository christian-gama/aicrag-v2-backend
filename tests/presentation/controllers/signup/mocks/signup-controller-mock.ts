import { PublicUser, User, UserAccount } from '@/domain/user'
import { AccountDbRepositoryProtocol } from '@/application/protocols/repositories/account/account-db-repository-protocol'
import { FilterUserDataProtocol } from '@/application/protocols/helpers/filter-user-data/filter-user-data-protocol'
import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { HttpHelper } from '@/presentation/http/helper/http-helper'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/http/protocols'
import { SignUpController } from '@/presentation/controllers/signup/signup-controller'
import { makeFakePublicUser } from '@/tests/domain/mocks/public-user-mock'
import { makeFakeUser } from '@/tests/domain/mocks/user-mock'

const makeAccountDbRepositoryStub = (fakeUser: User): AccountDbRepositoryProtocol => {
  class AccountDbRepositoryStub implements AccountDbRepositoryProtocol {
    async saveAccount (account: UserAccount): Promise<User> {
      return Promise.resolve(fakeUser)
    }

    async findAccountByEmail (email: string): Promise<User | undefined> {
      return Promise.resolve(undefined)
    }
  }

  return new AccountDbRepositoryStub()
}

const makeAccountValidatorStub = (): ValidatorProtocol => {
  class AccountValidatorStub implements ValidatorProtocol {
    validate (input: any): Error | undefined {
      return undefined
    }
  }

  return new AccountValidatorStub()
}

const makeFilterUserDataStub = (fakeUser: User): FilterUserDataProtocol => {
  class FilterUserDataStub implements FilterUserDataProtocol {
    filter (user: User): PublicUser {
      return makeFakePublicUser(fakeUser)
    }
  }

  return new FilterUserDataStub()
}

export interface SutTypes {
  sut: SignUpController
  accountDbRepositoryStub: AccountDbRepositoryProtocol
  accountValidatorStub: ValidatorProtocol
  fakePublicUser: PublicUser
  fakeUser: User
  filterUserDataStub: FilterUserDataProtocol
  httpHelper: HttpHelperProtocol
  request: HttpRequest
}

export const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const fakePublicUser = makeFakePublicUser(fakeUser)
  const filterUserDataStub = makeFilterUserDataStub(fakeUser)
  const accountDbRepositoryStub = makeAccountDbRepositoryStub(fakeUser)
  const accountValidatorStub = makeAccountValidatorStub()
  const httpHelper = new HttpHelper()
  const request = {
    body: {
      name: fakeUser.personal.name,
      email: fakeUser.personal.email,
      password: fakeUser.personal.password,
      passwordConfirmation: fakeUser.personal.password
    }
  }
  const sut = new SignUpController(
    accountDbRepositoryStub,
    accountValidatorStub,
    filterUserDataStub,
    httpHelper
  )

  return {
    sut,
    accountDbRepositoryStub,
    accountValidatorStub,
    fakePublicUser,
    fakeUser,
    filterUserDataStub,
    httpHelper,
    request
  }
}
