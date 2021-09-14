import { User } from '@/domain/user'
import { ValidateActivationCode } from '@/application/usecases/validators/codes/validate-activation-code'
import { AccountDbRepositoryProtocol } from '@/infra/database/mongodb/account'
import { makeAccountDbRepositoryStub } from '@/tests/__mocks__/infra/database/mongodb/account/mock-account-db-repository'
import { makeFakeUser } from '@/tests/__mocks__/domain/mock-user'

interface SutTypes {
  sut: ValidateActivationCode
  accountDbRepositoryStub: AccountDbRepositoryProtocol
  fakeUser: User
}

export const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const accountDbRepositoryStub = makeAccountDbRepositoryStub(fakeUser)
  const sut = new ValidateActivationCode(accountDbRepositoryStub)

  return { sut, accountDbRepositoryStub, fakeUser }
}
