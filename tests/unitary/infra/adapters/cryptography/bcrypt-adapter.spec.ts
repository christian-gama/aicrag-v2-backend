import { BcryptAdapter } from '@/infra/adapters/cryptography/bcrypt'

import bcrypt from 'bcrypt'

interface SutTypes {
  sut: BcryptAdapter
  salt: number
}

const makeSut = (): SutTypes => {
  const salt = 1
  const sut = new BcryptAdapter(salt)

  return { sut, salt }
}

describe('BcryptAdapter', () => {
  describe('hash', () => {
    it('Should call bcrypt with correct values', async () => {
      const { sut, salt } = makeSut()
      const hashSpy = jest.spyOn(bcrypt, 'hash')

      await sut.hash('value')

      expect(hashSpy).toHaveBeenCalledWith('value', salt)
    })

    it('Should return a string', async () => {
      const { sut } = makeSut()

      const value = await sut.hash('value')

      expect(typeof value).toBe('string')
    })

    it('Should return a hashed value', async () => {
      const { sut } = makeSut()

      const value = await sut.hash('value')

      expect(value).not.toBe('value')
    })

    it('Should throw if bcrypt throws', async () => {
      const { sut } = makeSut()
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(async () => Promise.reject(new Error()))

      const promise = sut.hash('value')

      await expect(promise).rejects.toThrow()
    })
  })

  describe('compare', () => {
    it('Should call bcrypt with correct values', async () => {
      const { sut } = makeSut()
      const compareSpy = jest.spyOn(bcrypt, 'compare')

      await sut.compare('value', 'value2')

      expect(compareSpy).toHaveBeenCalledWith('value', 'value2')
    })

    it('Should return a boolean', async () => {
      const { sut, salt } = makeSut()
      const encrypted = await bcrypt.hash('value', salt)

      const value = await sut.compare('value', encrypted)

      expect(typeof value).toBe('boolean')
    })

    it('Should return true if encrypted value is equal to value', async () => {
      const { sut, salt } = makeSut()
      const encrypted = await bcrypt.hash('value', salt)

      const value = await sut.compare('value', encrypted)

      expect(value).toBe(true)
    })

    it('Should return false if encrypted value is equal to value', async () => {
      const { sut, salt } = makeSut()
      const encrypted = await bcrypt.hash('value', salt)

      const value = await sut.compare('different_value', encrypted)

      expect(value).toBe(false)
    })

    it('Should throw if bcrypt throws', async () => {
      const { sut } = makeSut()
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => Promise.reject(new Error()))

      const promise = sut.compare('value', 'value2')

      await expect(promise).rejects.toThrow()
    })
  })
})
