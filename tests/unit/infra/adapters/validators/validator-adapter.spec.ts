import { ValidatorAdapter } from '@/infra/adapters/validators'

import faker from 'faker'

interface SutTypes {
  sut: ValidatorAdapter
}

const makeSut = (): SutTypes => {
  const sut = new ValidatorAdapter()

  return { sut }
}

describe('validatorAdapter', () => {
  describe('isEmail', () => {
    it('should return true if value is a valid email', () => {
      const { sut } = makeSut()
      const value = sut.isEmail(faker.internet.email())

      expect(value).toBe(true)
    })

    it('should return false if value is an invalid email', () => {
      const { sut } = makeSut()
      const value = sut.isEmail(faker.random.word())

      expect(value).toBe(false)
    })
  })
})
