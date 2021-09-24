import { IPublicUser, IUser } from '@/domain'

import { FilterUserDataProtocol, UuidProtocol, ValidationCodeProtocol } from '@/application/protocols/helpers'

import { makeFakePublicUser } from './mock-user'

export const makeFilterUserDataStub = (fakeUser: IUser): FilterUserDataProtocol => {
  class FilterUserDataStub implements FilterUserDataProtocol {
    filter (user: IUser): IPublicUser {
      return makeFakePublicUser(fakeUser)
    }
  }

  return new FilterUserDataStub()
}

export const makeUuidStub = (): UuidProtocol => {
  class UuidProtocolStub implements UuidProtocol {
    generate (): string {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    }
  }

  return new UuidProtocolStub()
}

export const makeValidationCodeStub = (): ValidationCodeProtocol => {
  class ValidationCode implements ValidationCodeProtocol {
    generate (): string {
      return 'any_code'
    }
  }

  return new ValidationCode()
}
