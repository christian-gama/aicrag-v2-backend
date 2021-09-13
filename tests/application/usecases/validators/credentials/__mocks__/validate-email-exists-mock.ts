import { User, UserAccount } from '@/domain/user'
import { UpdateUserOptions } from '@/domain/user/update-user-options'
import { AccountDbRepositoryProtocol } from '@/application/protocols/repositories/account/account-db-repository-protocol'
import { ValidateEmailExists } from '@/application/usecases/validators/credentials/'
import { makeFakeUser } from '@/tests/domain/__mocks__/user-mock'

const fakeUser = makeFakeUser()

const makeAccountDbRepositoryStub = (): AccountDbRepositoryProtocol => {
  class AccountDbRepositoryStub implements AccountDbRepositoryProtocol {
    async saveAccount (account: UserAccount): Promise<User> {
      return Promise.resolve(fakeUser)
    }

    async findAccountByEmail (email: string): Promise<User | undefined> {
      return Promise.resolve(fakeUser)
    }

    async updateUser (user: User, update: UpdateUserOptions): Promise<User | undefined> {
      return Promise.resolve(fakeUser)
    }
  }

  return new AccountDbRepositoryStub()
}

interface SutTypes {
  sut: ValidateEmailExists
  accountDbRepositoryStub: AccountDbRepositoryProtocol
  fakeUser: User
}

export const makeSut = (): SutTypes => {
  const accountDbRepositoryStub = makeAccountDbRepositoryStub()
  const sut = new ValidateEmailExists(accountDbRepositoryStub)

  return { sut, accountDbRepositoryStub, fakeUser }
}
