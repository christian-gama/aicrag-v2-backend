import { BcryptAdapter } from '@/infra/adapters/cryptography'

import bcrypt from 'bcrypt'

interface SutTypes {
  salt: number
  sut: BcryptAdapter
}

const makeSut = (): SutTypes => {
  const salt = 1
  const sut = new BcryptAdapter(salt)

  return { salt, sut }
}

describe('bcryptAdapter', () => {
  describe('compare', () => {
    it('should call bcrypt with correct values', async () => {
      expect.hasAssertions()

      const { sut } = makeSut()
      const compareSpy = jest.spyOn(bcrypt, 'compare')

      await sut.compare('value', 'value2')

      expect(compareSpy).toHaveBeenCalledWith('value', 'value2')
    })

    it('should return a boolean', async () => {
      expect.hasAssertions()

      const { salt, sut } = makeSut()
      const encrypted = await bcrypt.hash('value', salt)

      const value = await sut.compare('value', encrypted)

      expect(typeof value).toBe('boolean')
    })

    it('should return true if encrypted value is equal to value', async () => {
      expect.hasAssertions()

      const { salt, sut } = makeSut()
      const encrypted = await bcrypt.hash('value', salt)

      const value = await sut.compare('value', encrypted)

      expect(value).toBe(true)
    })

    it('should return false if encrypted value is equal to value', async () => {
      expect.hasAssertions()

      const { salt, sut } = makeSut()
      const encrypted = await bcrypt.hash('value', salt)

      const value = await sut.compare('different_value', encrypted)

      expect(value).toBe(false)
    })

    it('should throw if bcrypt throws', async () => {
      expect.hasAssertions()

      const { sut } = makeSut()
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => await Promise.reject(new Error()))

      const promise = sut.compare('value', 'value2')

      await expect(promise).rejects.toThrow('')
    })
  })

  describe('hash', () => {
    it('should call bcrypt with correct values', async () => {
      expect.hasAssertions()

      const { sut, salt } = makeSut()
      const hashSpy = jest.spyOn(bcrypt, 'hash')

      await sut.hash('value')

      expect(hashSpy).toHaveBeenCalledWith('value', salt)
    })

    it('should return a string', async () => {
      expect.hasAssertions()

      const { sut } = makeSut()

      const value = await sut.hash('value')

      expect(typeof value).toBe('string')
    })

    it('should return a hashed value', async () => {
      expect.hasAssertions()

      const { sut } = makeSut()

      const value = await sut.hash('value')

      expect(value).not.toBe('value')
    })

    it('should throw if bcrypt throws', async () => {
      expect.hasAssertions()

      const { sut } = makeSut()
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(async () => await Promise.reject(new Error()))

      const promise = sut.hash('value')

      await expect(promise).rejects.toThrow('')
    })
  })
})
