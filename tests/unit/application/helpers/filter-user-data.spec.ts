import { IUser } from '@/domain'

import { FilterUserDataProtocol } from '@/application/protocols/helpers'
import { FilterUserData } from '@/application/usecases/helpers'

import { makeFakeUser } from '@/tests/__mocks__'

interface SutTypes {
  sut: FilterUserDataProtocol
  fakeUser: IUser
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const sut = new FilterUserData()

  return { sut, fakeUser }
}

describe('FilterUserData', () => {
  it('Should return a public user', () => {
    const { sut, fakeUser } = makeSut()

    const value = sut.filter(fakeUser)

    expect(value).toEqual({
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
