import { IUser } from '@/domain'

import { FilterUserDataProtocol } from '@/application/protocols/helpers'
import { FilterUserData } from '@/application/usecases/helpers'

import { makeFakeUser } from '@/tests/__mocks__'

interface SutTypes {
  fakeUser: IUser
  sut: FilterUserDataProtocol
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const sut = new FilterUserData()

  return { fakeUser, sut }
}

describe('filterUserData', () => {
  it('should return a public user', () => {
    expect.hasAssertions()

    const { fakeUser, sut } = makeSut()

    const value = sut.filter(fakeUser)

    expect(value).toStrictEqual({
      personal: {
        email: fakeUser.personal.email,
        id: fakeUser.personal.id,
        name: fakeUser.personal.name
      },
      settings: {
        currency: fakeUser.settings.currency
      }
    })
  })
})
