import { makeSut } from './mocks/bcrypt-adapter-mock'

import bcrypt from 'bcrypt'

describe('BcryptAdapter', () => {
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
})
