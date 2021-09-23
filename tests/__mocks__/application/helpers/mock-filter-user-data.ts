import { IUser, IPublicUser } from '@/domain/user'
import { FilterUserDataProtocol } from '@/application/protocols/helpers'
import { makeFakePublicUser } from '../../domain/mock-public-user'

export const makeFilterUserDataStub = (fakeUser: IUser): FilterUserDataProtocol => {
  class FilterUserDataStub implements FilterUserDataProtocol {
    filter (user: IUser): IPublicUser {
      return makeFakePublicUser(fakeUser)
    }
  }

  return new FilterUserDataStub()
}
