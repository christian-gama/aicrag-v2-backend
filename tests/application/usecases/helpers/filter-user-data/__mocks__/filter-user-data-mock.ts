import { User } from '@/domain/user'
import { FilterUserDataProtocol } from '@/application/protocols/helpers/filter-user-data/filter-user-data-protocol'
import { FilterUserData } from '@/application/usecases/helpers/filter-user-data/filter-user-data'
import { makeFakeUser } from '@/tests/domain/__mocks__/user-mock'

interface SutTypes {
  sut: FilterUserDataProtocol
  fakeUser: User
}

export const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const sut = new FilterUserData()

  return { sut, fakeUser }
}
