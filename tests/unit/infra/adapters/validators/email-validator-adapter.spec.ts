import { EmailValidatorAdapter } from '@/infra/adapters/validators'

import faker from 'faker'

interface SutTypes {
  sut: EmailValidatorAdapter
}

const makeSut = (): SutTypes => {
  const sut = new EmailValidatorAdapter()

  return { sut }
}

describe('emailValidatorAdapter', () => {
  it('should return true if value is a valid email', () => {
    expect.hasAssertions()

    const { sut } = makeSut()
    const value = sut.isEmail(faker.internet.email())

    expect(value).toBe(true)
  })

  it('should return false if value is an invalid email', () => {
    expect.hasAssertions()

    const { sut } = makeSut()
    const value = sut.isEmail(faker.random.word())

    expect(value).toBe(false)
  })
})
