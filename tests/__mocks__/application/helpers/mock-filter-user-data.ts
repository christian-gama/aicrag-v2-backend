import { User, PublicUser } from '@/domain/user'
import { FilterUserDataProtocol } from '@/application/usecases/helpers/filter-user-data'
import { makeFakePublicUser } from '../../domain/mock-public-user'

export const makeFilterUserDataStub = (fakeUser: User): FilterUserDataProtocol => {
  class FilterUserDataStub implements FilterUserDataProtocol {
    filter (user: User): PublicUser {
      return makeFakePublicUser(fakeUser)
    }
  }

  return new FilterUserDataStub()
}
