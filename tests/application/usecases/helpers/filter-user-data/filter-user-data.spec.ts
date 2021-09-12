import { makeSut } from './__mocks__/filter-user-data-mock'

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
