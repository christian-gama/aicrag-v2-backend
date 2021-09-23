import { IUser } from '@/domain'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories/user/user-db-repository-protocol'
import { ComparerProtocol } from '@/application/protocols/cryptography/'
import { ValidatePasswordMatch } from '@/application/usecases/validators/credentials-validator'
import { makeUserDbRepositoryStub } from '@/tests/__mocks__/infra/database/mongodb/user/mock-user-db-repository'
import { makeComparerStub } from '@/tests/__mocks__/infra/adapters/cryptography/mock-bcrypt-adapter'
import { makeFakeUser } from '@/tests/__mocks__/domain/mock-user'

interface SutTypes {
  sut: ValidatePasswordMatch
  userDbRepositoryStub: UserDbRepositoryProtocol
  comparerStub: ComparerProtocol
  fakeUser: IUser
}

export const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)
  const comparerStub = makeComparerStub()
  const sut = new ValidatePasswordMatch(userDbRepositoryStub, comparerStub)

  return { sut, userDbRepositoryStub, comparerStub, fakeUser }
}
