import { IUser } from '@/domain'
import { FilterUserDataProtocol } from '@/application/protocols/helpers/filter-user-data/filter-user-data-protocol'
import { FilterUserData } from '@/application/usecases/helpers/filter-user-data/filter-user-data'
import { makeFakeUser } from '@/tests/__mocks__/domain/mock-user'

interface SutTypes {
  sut: FilterUserDataProtocol
  fakeUser: IUser
}

export const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const sut = new FilterUserData()

  return { sut, fakeUser }
}
