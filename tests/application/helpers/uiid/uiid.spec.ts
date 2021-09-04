import { makeSut } from './mocks/uiid-mock'

describe('Uiid', () => {
  it('Should return an uiid with 24 digits', () => {
    const sut = makeSut()

    const value = sut.generate()

    expect(value.length).toBe(24)
  })

  it('Should return a string', () => {
    const sut = makeSut()

    const value = sut.generate()

    expect(typeof value).toBe('string')
  })
})
