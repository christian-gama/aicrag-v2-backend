import { User } from '@/domain/user'
import { AccountDbRepositoryProtocol } from '@/application/protocols/repositories/account/account-db-repository-protocol'
import { ValidateEmailExists } from '@/application/usecases/validators/credentials/'
import { makeAccountDbRepositoryStub } from '@/tests/__mocks__/infra/database/mongodb/account/mock-account-db-repository'
import { makeFakeUser } from '@/tests/__mocks__/domain/mock-user'

interface SutTypes {
  sut: ValidateEmailExists
  accountDbRepositoryStub: AccountDbRepositoryProtocol
  fakeUser: User
}

export const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const accountDbRepositoryStub = makeAccountDbRepositoryStub(fakeUser)
  const sut = new ValidateEmailExists(accountDbRepositoryStub)

  return { sut, accountDbRepositoryStub, fakeUser }
}
