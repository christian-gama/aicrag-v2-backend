import { User } from '@/domain/user'
import { AccountDbRepositoryProtocol } from '@/application/protocols/repositories/account/account-db-repository-protocol'
import { ComparerProtocol } from '@/application/protocols/cryptography/'
import { ValidatePasswordMatch } from '@/application/usecases/validators/credentials/'
import { makeAccountDbRepositoryStub } from '@/tests/__mocks__/infra/database/mongodb/account/mock-account-db-repository'
import { makeComparerStub } from '@/tests/__mocks__/infra/adapters/cryptography/mock-bcrypt-adapter'
import { makeFakeUser } from '@/tests/__mocks__/domain/mock-user'

interface SutTypes {
  sut: ValidatePasswordMatch
  accountDbRepositoryStub: AccountDbRepositoryProtocol
  comparerStub: ComparerProtocol
  fakeUser: User
}

export const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const accountDbRepositoryStub = makeAccountDbRepositoryStub(fakeUser)
  const comparerStub = makeComparerStub()
  const sut = new ValidatePasswordMatch(accountDbRepositoryStub, comparerStub)

  return { sut, accountDbRepositoryStub, comparerStub, fakeUser }
}
