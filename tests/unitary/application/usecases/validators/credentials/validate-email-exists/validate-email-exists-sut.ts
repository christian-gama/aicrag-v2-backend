import { IUser } from '@/domain'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { ValidateEmailExists } from '@/application/usecases/validators'
import { makeUserDbRepositoryStub } from '@/tests/__mocks__/infra/database/mongodb/user/mock-user-db-repository'
import { makeFakeUser } from '@/tests/__mocks__/domain/mock-user'

interface SutTypes {
  sut: ValidateEmailExists
  userDbRepositoryStub: UserDbRepositoryProtocol
  fakeUser: IUser
}

export const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)
  const sut = new ValidateEmailExists(userDbRepositoryStub)

  return { sut, userDbRepositoryStub, fakeUser }
}
