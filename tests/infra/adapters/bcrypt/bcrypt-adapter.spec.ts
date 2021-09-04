import { makeSut } from './mocks/bcrypt-adapter-mock'

import bcrypt from 'bcrypt'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return Promise.resolve('hashed_value')
  }
}))

describe('BcryptAdapter', () => {
  it('Should call bcrypt with correct values', async () => {
    const { sut, salt } = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.hash('value')

    expect(hashSpy).toHaveBeenCalledWith('value', salt)
  })
})
