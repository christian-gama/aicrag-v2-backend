import { IUser, PublicUser } from '@/domain/user/index'
import { FilterUserDataProtocol } from '@/application/usecases/helpers/filter-user-data'
import { makeFakePublicUser } from '../../domain/mock-public-user'

export const makeFilterUserDataStub = (fakeUser: IUser): FilterUserDataProtocol => {
  class FilterUserDataStub implements FilterUserDataProtocol {
    filter (user: IUser): PublicUser {
      return makeFakePublicUser(fakeUser)
    }
  }

  return new FilterUserDataStub()
}
