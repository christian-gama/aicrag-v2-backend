import { IPublicUser, IUser } from '@/domain'
import { IFilterUserData, IUuid, IPin } from '@/domain/helpers'
import { makeFakePublicUser } from './mock-user'

export const makeFilterUserDataStub = (fakeUser: IUser): IFilterUserData => {
  class FilterUserDataStub implements IFilterUserData {
    filter (user: IUser): IPublicUser {
      return makeFakePublicUser(fakeUser)
    }
  }

  return new FilterUserDataStub()
}

export const makeUuidStub = (): IUuid => {
  class IUuidStub implements IUuid {
    generate (): string {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    }
  }

  return new IUuidStub()
}

export const makePinStub = (): IPin => {
  class Pin implements IPin {
    generate (): string {
      return 'any_pin'
    }
  }

  return new Pin()
}
