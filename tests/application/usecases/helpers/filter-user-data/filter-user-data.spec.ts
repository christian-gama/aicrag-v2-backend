import { makeSut } from './filter-user-data-sut'

describe('FilterUserData', () => {
  it('Should return a public user', () => {
    const { sut, fakeUser } = makeSut()

    const value = sut.filter(fakeUser)

    expect(value).toEqual({
      personal: {
        id: fakeUser.personal.id,
        name: fakeUser.personal.name,
        email: fakeUser.personal.email
      },
      settings: {
        currency: fakeUser.settings.currency
      }
    })
  })
})
