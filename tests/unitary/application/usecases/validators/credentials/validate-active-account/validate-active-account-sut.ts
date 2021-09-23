import { IUser } from '@/domain'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories/user/user-db-repository-protocol'
import {
  ValidateActiveAccount,
  ValidatorProtocol
} from '@/application/usecases/validators/credentials-validator'
import { makeUserDbRepositoryStub } from '@/tests/__mocks__/infra/database/mongodb/user/mock-user-db-repository'
import { makeFakeUser } from '@/tests/__mocks__/domain/mock-user'

interface SutTypes {
  sut: ValidatorProtocol
  userDbRepositoryStub: UserDbRepositoryProtocol
  fakeUser: IUser
}

export const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  fakeUser.settings.accountActivated = true

  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)
  const sut = new ValidateActiveAccount(userDbRepositoryStub)

  return { sut, userDbRepositoryStub, fakeUser }
}
