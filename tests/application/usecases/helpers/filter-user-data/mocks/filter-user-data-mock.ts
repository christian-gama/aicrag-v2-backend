import { FilterUserDataProtocol } from '@/application/protocols/helpers/filter-user-data/filter-user-data-protocol'
import { User } from '@/domain/user'
import { makeFakeUser } from '@/tests/domain/mocks/user-mock'
import { FilterUserData } from '@/application/usecases/helpers/filter-user-data/filter-user-data'

interface SutTypes {
  sut: FilterUserDataProtocol
  fakeUser: User
}

export const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const sut = new FilterUserData()

  return { sut, fakeUser }
}
