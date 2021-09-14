import { User } from '@/domain/user'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories/user/user-db-repository-protocol'
import { ValidateEmailExists } from '@/application/usecases/validators/credentials-validator'
import { makeUserDbRepositoryStub } from '@/tests/__mocks__/infra/database/mongodb/user/mock-user-db-repository'
import { makeFakeUser } from '@/tests/__mocks__/domain/mock-user'

interface SutTypes {
  sut: ValidateEmailExists
  userDbRepositoryStub: UserDbRepositoryProtocol
  fakeUser: User
}

export const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)
  const sut = new ValidateEmailExists(userDbRepositoryStub)

  return { sut, userDbRepositoryStub, fakeUser }
}
