import { makeSut } from './mocks/jwt-adapter-mock'
import jwt from 'jsonwebtoken'

describe('JwtAdapter', () => {
  it('Should call sign with correct value', () => {
    const { sut, secret } = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')

    sut.encrypt('value')

    expect(signSpy).toHaveBeenCalledWith({ id: 'value' }, secret)
  })

  it('Should return an encrypted value', () => {
    const { sut } = makeSut()

    const value = sut.encrypt('value')

    expect(value).not.toBe('value')
  })

  it('Should throw if sign throws', async () => {
    const { sut } = makeSut()
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => { throw new Error() })

    expect(sut.encrypt).toThrow()
  })
})
