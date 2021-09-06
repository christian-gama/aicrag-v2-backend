import { AccountRepositoryProtocol } from '@/application/protocols/repositories/account/account-repository-protocol'
import { User, UserAccount } from '@/domain/user'
import { AccountMongoRepository } from '@/infra/database/mongodb/account/account-mongo-repository'
import { makeFakeUser } from '@/tests/domain/mocks/user-mock'

const makeAccountRepositoryStub = (fakeUser: User): AccountRepositoryProtocol => {
  class AccountRepositoryStub implements AccountRepositoryProtocol {
    async createAccount (account: UserAccount): Promise<User> {
      return Promise.resolve(fakeUser)
    }
  }

  return new AccountRepositoryStub()
}

interface SutTypes {
  sut: AccountMongoRepository
  accountRepositoryStub: AccountRepositoryProtocol
  fakeUser: User
}

export const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const accountRepositoryStub = makeAccountRepositoryStub(fakeUser)
  const sut = new AccountMongoRepository(accountRepositoryStub)

  return { sut, fakeUser, accountRepositoryStub }
}
