import { makeSut } from './mocks/email-validator-mock'

import faker from 'faker'

describe('EmailValidatorAdapter', () => {
  it('Should return true if value is a valid email', () => {
    const sut = makeSut()
    const value = sut.isEmail(faker.internet.email())

    expect(value).toBe(true)
  })

  it('Should return false if value is an invalid email', () => {
    const sut = makeSut()
    const value = sut.isEmail(faker.random.word())

    expect(value).toBe(false)
  })
})
