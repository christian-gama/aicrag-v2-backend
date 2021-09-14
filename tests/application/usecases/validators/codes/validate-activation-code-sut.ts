import { User } from '@/domain/user'
import { ValidateActivationCode } from '@/application/usecases/validators/codes-validator/validate-activation-code'
import { UserDbRepositoryProtocol } from '@/infra/database/mongodb/user'
import { makeUserDbRepositoryStub } from '@/tests/__mocks__/infra/database/mongodb/user/mock-user-db-repository'
import { makeFakeUser } from '@/tests/__mocks__/domain/mock-user'

interface SutTypes {
  sut: ValidateActivationCode
  userDbRepositoryStub: UserDbRepositoryProtocol
  fakeUser: User
}

export const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)
  const sut = new ValidateActivationCode(userDbRepositoryStub)

  return { sut, userDbRepositoryStub, fakeUser }
}
