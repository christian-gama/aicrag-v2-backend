import { IPublicUser, IUser } from '@/domain'
import { IFilterUserData, IUuid, IValidationCode } from '@/domain/helpers'

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

export const makeValidationCodeStub = (): IValidationCode => {
  class ValidationCode implements IValidationCode {
    generate (): string {
      return 'any_code'
    }
  }

  return new ValidationCode()
}
